package v1alpha1

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// EDIT THIS FILE!  THIS IS SCAFFOLDING FOR YOU TO OWN!
// NOTE: json tags are required.  Any new fields you add must have json tags for the fields to be serialized.

// OrdererSpec defines the desired state of Orderer
// +k8s:openapi-gen=true
type OrdererSpec struct {
	// INSERT ADDITIONAL SPEC INFO[0000] Running OpenAPI code-generation for Custom Resource group versions: [fabric:[v1alpha1], ] FIELDS - desired state of cluster
	// Important: Run "operator-sdk generate k8s" to regenerate code after modifying this file
	// Add custom validation using kubebuilder tags: https://book-v1.book.kubebuilder.io/beyond_basics/generating_crd.html
	StorageSize   string               `json:"storageSize"`
	StorageClass  string               `json:"storageClass"`
	Image         string               `json:"image"`
	OrdererConfig []*OrdererConfigList `json:"ordererConfig"`
}

type OrdererConfigList struct {
	Name  string `json:"name"`
	Value string `json:"value"`
}

// OrdererStatus defines the observed state of Orderer
// +k8s:openapi-gen=true
type OrdererStatus struct {
	// INSERT ADDITIONAL STATUS FIELD - define observed state of cluster
	// Important: Run "operator-sdk generate k8s" to regenerate code after modifying this file
	// Add custom validation using kubebuilder tags: https://book-v1.book.kubebuilder.io/beyond_basics/generating_crd.html
}

// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object

// Orderer is the Schema for the orderers API
// +k8s:openapi-gen=true
// +kubebuilder:subresource:status
type Orderer struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   OrdererSpec   `json:"spec,omitempty"`
	Status OrdererStatus `json:"status,omitempty"`
}

// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object

// OrdererList contains a list of Orderer
type OrdererList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []Orderer `json:"items"`
}

func init() {
	SchemeBuilder.Register(&Orderer{}, &OrdererList{})
}
