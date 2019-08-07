package v1alpha1

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// EDIT THIS FILE!  THIS IS SCAFFOLDING FOR YOU TO OWN!
// NOTE: json tags are required.  Any new fields you add must have json tags for the fields to be serialized.

// CASpec defines the desired state of CA
// +k8s:openapi-gen=true
type CASpec struct {
	// INSERT ADDITIONAL SPEC FIELDS - desired state of cluster
	// Important: Run "operator-sdk generate k8s" to regenerate code after modifying this file
	// Add custom validation using kubebuilder tags: https://book-v1.book.kubebuilder.io/beyond_basics/generating_crd.html
	AdminName     string `json:"adminName"`
	AdminPassword string `json:"adminPassword"`
	PrivateKey    string `json:"privateKey"`
	Cert          string `json:"cert"`
	TLSEnabled    bool   `json:"tlsEnabled"`
	TLSPrivateKey string `json:"tlsPrivateKey"`
	TLSCert       string `json:"tlsCert"`
	StorageSize   string `json:"storageSize"`
	StorageClass  string `json:"storageClass"`
	Image         string `json:"image"`
}

// CAStatus defines the observed state of CA
// +k8s:openapi-gen=true
type CAStatus struct {
	// INSERT ADDITIONAL STATUS FIELD - define observed state of cluster
	// Important: Run "operator-sdk generate k8s" to regenerate code after modifying this file
	// Add custom validation using kubebuilder tags: https://book-v1.book.kubebuilder.io/beyond_basics/generating_crd.html
	Endpoint string `json:"endpoint"`
}

// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object

// CA is the Schema for the cas API
// +k8s:openapi-gen=true
// +kubebuilder:subresource:status
type CA struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   CASpec   `json:"spec,omitempty"`
	Status CAStatus `json:"status,omitempty"`
}

// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object

// CAList contains a list of CA
type CAList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []CA `json:"items"`
}

func init() {
	SchemeBuilder.Register(&CA{}, &CAList{})
}
