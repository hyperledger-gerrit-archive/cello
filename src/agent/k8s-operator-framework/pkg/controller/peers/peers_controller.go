package peers

import (
	"context"

	appv1alpha1 "cello/k8s-fabric-operator/pkg/apis/app/v1alpha1"

	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/types"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/controller"
	"sigs.k8s.io/controller-runtime/pkg/controller/controllerutil"
	"sigs.k8s.io/controller-runtime/pkg/handler"
	"sigs.k8s.io/controller-runtime/pkg/manager"
	"sigs.k8s.io/controller-runtime/pkg/reconcile"
	logf "sigs.k8s.io/controller-runtime/pkg/runtime/log"
	"sigs.k8s.io/controller-runtime/pkg/source"
)

var log = logf.Log.WithName("controller_peers")

/**
* USER ACTION REQUIRED: This is a scaffold file intended for the user to modify with their own Controller
* business logic.  Delete these comments after modifying this file.*
*/

// Add creates a new Peers Controller and adds it to the Manager. The Manager will set fields on the Controller
// and Start it when the Manager is Started.
func Add(mgr manager.Manager) error {
	return add(mgr, newReconciler(mgr))
}

// newReconciler returns a new reconcile.Reconciler
func newReconciler(mgr manager.Manager) reconcile.Reconciler {
	return &ReconcilePeers{client: mgr.GetClient(), scheme: mgr.GetScheme()}
}

// add adds a new Controller to mgr with r as the reconcile.Reconciler
func add(mgr manager.Manager, r reconcile.Reconciler) error {
	// Create a new controller
	c, err := controller.New("peers-controller", mgr, controller.Options{Reconciler: r})
	if err != nil {
		return err
	}

	// Watch for changes to primary resource Peers
	err = c.Watch(&source.Kind{Type: &appv1alpha1.Peers{}}, &handler.EnqueueRequestForObject{})
	if err != nil {
		return err
	}

	// TODO(user): Modify this to be the types you create that are owned by the primary resource
	// Watch for changes to secondary resource Pods and requeue the owner Peers
	err = c.Watch(&source.Kind{Type: &corev1.Pod{}}, &handler.EnqueueRequestForOwner{
		IsController: true,
		OwnerType:    &appv1alpha1.Peers{},
	})
	if err != nil {
		return err
	}

	return nil
}

// blank assignment to verify that ReconcilePeers implements reconcile.Reconciler
var _ reconcile.Reconciler = &ReconcilePeers{}

// ReconcilePeers reconciles a Peers object
type ReconcilePeers struct {
	// This client, initialized using mgr.Client() above, is a split client
	// that reads objects from the cache and writes to the apiserver
	client client.Client
	scheme *runtime.Scheme
}

// Reconcile reads that state of the cluster for a Peers object and makes changes based on the state read
// and what is in the Peers.Spec
// TODO(user): Modify this Reconcile function to implement your Controller logic.  This example creates
// a Pod as an example
// Note:
// The Controller will requeue the Request to be processed again if the returned error is non-nil or
// Result.Requeue is true, otherwise upon completion it will remove the work from the queue.
func (r *ReconcilePeers) Reconcile(request reconcile.Request) (reconcile.Result, error) {
	reqLogger := log.WithValues("Request.Namespace", request.Namespace, "Request.Name", request.Name)
	reqLogger.Info("Reconciling Peers")

	// Fetch the Peers instance
	instance := &appv1alpha1.Peers{}
	err := r.client.Get(context.TODO(), request.NamespacedName, instance)
	if err != nil {
		if errors.IsNotFound(err) {
			// Request object not found, could have been deleted after reconcile request.
			// Owned objects are automatically garbage collected. For additional cleanup logic use finalizers.
			// Return and don't requeue
			return reconcile.Result{}, nil
		}
		// Error reading the object - requeue the request.
		return reconcile.Result{}, err
	}

	persistent_volumes := volumesforPods(instance)

	for _,pv := range persistent_volumes {
		found := &corev1.PersistentVolumeClaim{}
		err = r.client.Get(context.TODO(), client.ObjectKey{
			Namespace: "default",
			Name:      pv.PersistentVolumeClaim.ClaimName,
		}, found)
		if err != nil {
			return reconcile.Result{}, err
		}
	}
	
	//container_pods := []corev1.Container{}
	container_pods := containersforPods(instance)
	pod := newPodForCR(instance, container_pods, persistent_volumes)

	// Set Peers instance as the owner and controller
	if err := controllerutil.SetControllerReference(instance, pod, r.scheme); err != nil {
		return reconcile.Result{}, err
	}
	// Check if this Pod already exists
	found := &corev1.Pod{}
	err = r.client.Get(context.TODO(), types.NamespacedName{Name: pod.Name, Namespace: pod.Namespace}, found)
	if err != nil && errors.IsNotFound(err) {
		reqLogger.Info("Creating a new Pod", "Pod.Namespace", pod.Namespace, "Pod.Name", pod.Name)
		err = r.client.Create(context.TODO(), pod)
		if err != nil{
			return reconcile.Result{}, err
		} else {
			//Create Service
			service := newServiceForPod(instance)
			err = r.client.Create(context.TODO(), &service)
			if err != nil {
				return reconcile.Result{}, err
			}
			// Pod created successfully - don't requeue
			return reconcile.Result{}, nil
		}
	} else if err != nil {
		return reconcile.Result{}, err
	}

	// Pod already exists - don't requeue
	reqLogger.Info("Skip reconcile: Pod already exists", "Pod.Namespace", found.Namespace, "Pod.Name", found.Name)

	return reconcile.Result{}, nil
}

// newPodForCR returns a busybox pod with the same name/namespace as the cr
func newPodForCR(cr *appv1alpha1.Peers, containers []corev1.Container, persistent_volumes []corev1.Volume) *corev1.Pod {
	labels := map[string]string{
		"app": cr.Spec.Metadata.Labels.App,
		"role": cr.Spec.Metadata.Labels.Role,
		"peerId": cr.Spec.Metadata.Labels.PeerId,
		"org": cr.Spec.Metadata.Labels.Org,
	}

	return &corev1.Pod{
		ObjectMeta: metav1.ObjectMeta{
			Name:      cr.Name + "-pod",
			Namespace: cr.Namespace,
			Labels:    labels,
		},
		Spec: corev1.PodSpec{
			Containers:		containers,
			Volumes:		persistent_volumes,
		},
	}
}

func volumesforPods(instance *appv1alpha1.Peers) []corev1.Volume {
	persistent_volumes := []corev1.Volume{}

	for _,pv := range instance.Spec.Volumes{
		pv_name := pv.Name
		pvc_claimname := pv.PersistentVolumeClaim.ClaimName

		pv_persistentvolumeclaim := corev1.PersistentVolumeClaimVolumeSource{
			ClaimName: pvc_claimname,
		}
		pv_volumesource := corev1.VolumeSource{
			PersistentVolumeClaim: &pv_persistentvolumeclaim,
		}
		persistentvolume := corev1.Volume{
			Name: pv_name,
			VolumeSource: pv_volumesource,
		}

		persistent_volumes = append(persistent_volumes, persistentvolume)
	}

	return persistent_volumes
}

func containersforPods(instance *appv1alpha1.Peers) []corev1.Container {
	container_pods := []corev1.Container{}

	for _, i := range instance.Spec.Containers {
		container_name := i.Name
		//container_imagepullpolicy := i.ImagePullPolicy
		container_image := i.Image
		container_workingdir := i.WorkingDir
		container_volumemounts := []corev1.VolumeMount{}
		container_envs := []corev1.EnvVar{}
		container_ports := []corev1.ContainerPort{}
		container_command := i.Command

		for _, v := range i.VolumeMounts {
			vol_mountpath := v.MountPath
			vol_name := v.Name

			volume := corev1.VolumeMount{
				Name:		vol_name,
				MountPath:	vol_mountpath	,
			}
			container_volumemounts = append(container_volumemounts, volume)
		}

		for _,e := range i.Env {
			env_name := e.Name
			env_value := e.Value
			env := corev1.EnvVar{
				Name:	env_name,
				Value:	env_value,
			}

			container_envs = append(container_envs, env)
		}

		for _,p := range i.Ports {
			port := p.ContainerPort
			container_port := corev1.ContainerPort{
				ContainerPort:	int32(port),
			}

			container_ports = append(container_ports, container_port)
		}

		container := corev1.Container{
			Name:				container_name,
			Image:				container_image,
			//ImagePullPolicy:	container_imagepullpolicy,
			WorkingDir: 		container_workingdir,
			VolumeMounts: 		container_volumemounts,
			Env:				container_envs,
			Ports: 				container_ports,
			Command: 			container_command,
		}

		container_pods = append(container_pods, container)

	}

	return container_pods
}

func newServiceForPod(instance *appv1alpha1.Peers) corev1.Service {
	service_ports := []corev1.ServicePort{}
	for _, c := range instance.Spec.Containers {
		for _,p := range c.Ports {
			port := p.ContainerPort
			service_port := corev1.ServicePort{
				Name: 	p.Name,
				Port:	int32(port),
			}

			service_ports = append(service_ports, service_port)
		}
	}
	container_service := corev1.Service {
		ObjectMeta: metav1.ObjectMeta{
			Name:      instance.Name + "-service",
			Namespace:	"default",
			Labels:    map[string]string{
				"app": instance.Spec.Metadata.Labels.App,
			},
		},
		Spec: corev1.ServiceSpec{
			Ports:		service_ports,
			Selector:	map[string]string{
				"app": 		instance.Spec.Metadata.Labels.App,
				"role":		instance.Spec.Metadata.Labels.Role,
				"peerId":		instance.Spec.Metadata.Labels.PeerId,
				"org":		instance.Spec.Metadata.Labels.Org,
			},
			Type:	"NodePort",
		},
	}
	return container_service
}