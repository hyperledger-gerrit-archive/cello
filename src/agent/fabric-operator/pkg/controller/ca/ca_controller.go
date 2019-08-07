package ca

import (
	"context"

	fabric "github.com/hyperledger/cello/src/agent/fabric-operator/pkg/apis/fabric"
	fabricv1alpha1 "github.com/hyperledger/cello/src/agent/fabric-operator/pkg/apis/fabric/v1alpha1"
	appsv1 "k8s.io/api/apps/v1"
	corev1 "k8s.io/api/core/v1"
	"k8s.io/apimachinery/pkg/api/errors"
	"k8s.io/apimachinery/pkg/api/resource"
	"k8s.io/apimachinery/pkg/runtime"
	"sigs.k8s.io/controller-runtime/pkg/client"
	"sigs.k8s.io/controller-runtime/pkg/controller"
	"sigs.k8s.io/controller-runtime/pkg/controller/controllerutil"
	"sigs.k8s.io/controller-runtime/pkg/handler"
	"sigs.k8s.io/controller-runtime/pkg/manager"
	"sigs.k8s.io/controller-runtime/pkg/reconcile"
	logf "sigs.k8s.io/controller-runtime/pkg/runtime/log"
	"sigs.k8s.io/controller-runtime/pkg/source"
)

var log = logf.Log.WithName("controller_ca")

/**
* USER ACTION REQUIRED: This is a scaffold file intended for the user to modify with their own Controller
* business logic.  Delete these comments after modifying this file.*
 */

// Add creates a new CA Controller and adds it to the Manager. The Manager will set fields on the Controller
// and Start it when the Manager is Started.
func Add(mgr manager.Manager) error {
	return add(mgr, newReconciler(mgr))
}

// newReconciler returns a new reconcile.Reconciler
func newReconciler(mgr manager.Manager) reconcile.Reconciler {
	return &ReconcileCA{client: mgr.GetClient(), scheme: mgr.GetScheme()}
}

// add adds a new Controller to mgr with r as the reconcile.Reconciler
func add(mgr manager.Manager, r reconcile.Reconciler) error {
	// Create a new controller
	c, err := controller.New("ca-controller", mgr, controller.Options{Reconciler: r})
	if err != nil {
		return err
	}

	// Watch for changes to primary resource CA
	err = c.Watch(&source.Kind{Type: &fabricv1alpha1.CA{}}, &handler.EnqueueRequestForObject{})
	if err != nil {
		return err
	}

	// TODO(user): Modify this to be the types you create that are owned by the primary resource
	// Watch for changes to secondary resource Pods and requeue the owner CA
	err = c.Watch(&source.Kind{Type: &corev1.Pod{}}, &handler.EnqueueRequestForOwner{
		IsController: true,
		OwnerType:    &fabricv1alpha1.CA{},
	})
	if err != nil {
		return err
	}

	return nil
}

// blank assignment to verify that ReconcileCA implements reconcile.Reconciler
var _ reconcile.Reconciler = &ReconcileCA{}

// ReconcileCA reconciles a CA object
type ReconcileCA struct {
	// This client, initialized using mgr.Client() above, is a split client
	// that reads objects from the cache and writes to the apiserver
	client client.Client
	scheme *runtime.Scheme
}

// Reconcile reads that state of the cluster for a CA object and makes changes based on the state read
// and what is in the CA.Spec
// TODO(user): Modify this Reconcile function to implement your Controller logic.  This example creates
// a Pod as an example
// Note:
// The Controller will requeue the Request to be processed again if the returned error is non-nil or
// Result.Requeue is true, otherwise upon completion it will remove the work from the queue.
func (r *ReconcileCA) Reconcile(request reconcile.Request) (reconcile.Result, error) {
	reqLogger := log.WithValues("Request.Namespace", request.Namespace, "Request.Name", request.Name)
	reqLogger.Info("Reconciling Fabric CA")

	// Fetch the CA instance
	instance := &fabricv1alpha1.CA{}
	err := r.client.Get(context.TODO(), request.NamespacedName, instance)
	// isToBeDeleted := instance.GetDeletionTimestamp() != nil
	if err != nil {
		if errors.IsNotFound(err) {
			// Request object not found, could have been deleted after reconcile request.
			// Owned objects are automatically garbage collected. For additional cleanup logic use finalizers.
			// Return and don't requeue
			reqLogger.Info("Fabric CA resource not found. Ignoring since object must be deleted.")
			return reconcile.Result{}, nil
		}
		// Error reading the object - requeue the request.
		reqLogger.Error(err, "Failed to get Fabric CA.")
		return reconcile.Result{}, err
	}

	foundService := &corev1.Service{}
	err = r.client.Get(context.TODO(), request.NamespacedName, foundService)
	if err != nil && errors.IsNotFound(err) {
		// Define a new Service object
		service := r.newServiceForCR(instance)
		service.Name = request.Name
		service.Namespace = request.Namespace
		service.Labels["k8s-app"] = service.Name
		service.Spec.Selector["k8s-app"] = service.Name
		reqLogger.Info("Creating a new service.", "Service.Namespace", service.Namespace,
			"Service.Name", service.Name)
		err = r.client.Create(context.TODO(), service)
		if err != nil {
			reqLogger.Error(err, "Failed to create new service for CA.", "Service.Namespace",
				service.Namespace, "Service.Name", service.Name)
			return reconcile.Result{}, err
		}
	} else if err != nil {
		reqLogger.Error(err, "Failed to get CA service.")
		return reconcile.Result{}, err
	}

	foundSTS := &appsv1.StatefulSet{}
	err = r.client.Get(context.TODO(), request.NamespacedName, foundSTS)
	if err != nil && errors.IsNotFound(err) {
		// Define a new StatefulSet object
		sts := r.newSTSForCR(instance)
		sts.Name = request.Name
		sts.Namespace = request.Namespace
		sts.Spec.ServiceName = sts.Name
		sts.Spec.Selector.MatchLabels["k8s-app"] = sts.Name
		sts.Spec.VolumeClaimTemplates[0].Spec.StorageClassName = &instance.Spec.StorageClass
		sts.Spec.VolumeClaimTemplates[0].Spec.Resources.Requests["storage"] = resource.MustParse(instance.Spec.StorageSize)
		sts.Spec.Template.Labels["k8s-app"] = sts.Name
		sts.Spec.Template.Spec.Containers[0].Image = instance.Spec.Image
		sts.Spec.Template.Spec.Containers[0].Args[2] = instance.Spec.AdminName + ":" + instance.Spec.AdminPassword
		reqLogger.Info("Creating a new set.", "StatefulSet.Namespace", sts.Namespace,
			"StatefulSet.Name", sts.Name)
		err = r.client.Create(context.TODO(), sts)
		if err != nil {
			reqLogger.Error(err, "Failed to create new statefulset for CA.", "StatefulSet.Namespace",
				sts.Namespace, "StatefulSet.Name", sts.Name)
			return reconcile.Result{}, err
		}
	} else if err != nil {
		reqLogger.Error(err, "Failed to get CA StatefulSet.")
		return reconcile.Result{}, err
	}
	//return reconcile.Result{Requeue: true}, nil
	return reconcile.Result{}, nil
}

// newServiceForCR returns a fabric CA service with the same name/namespace as the cr
func (r *ReconcileCA) newServiceForCR(cr *fabricv1alpha1.CA) *corev1.Service {
	obj, _, _ := fabric.GetObjectFromTemplate("ca_service.json")
	service, ok := obj.(*corev1.Service)
	if !ok {
		service = nil
	} else {
		controllerutil.SetControllerReference(cr, service, r.scheme)
	}
	return service
}

// newPodForCR returns a fabric CA statefulset with the same name/namespace as the cr
func (r *ReconcileCA) newSTSForCR(cr *fabricv1alpha1.CA) *appsv1.StatefulSet {
	obj, _, err := fabric.GetObjectFromTemplate("ca_statefulset.json")
	if err != nil {
		log.Error(err, "Failed to load statefulset.")
	}
	sts, ok := obj.(*appsv1.StatefulSet)
	if !ok {
		sts = nil
	} else {
		controllerutil.SetControllerReference(cr, sts, r.scheme)
	}
	return sts
}
