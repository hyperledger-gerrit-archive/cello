package v1alpha1

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// EDIT THIS FILE!  THIS IS SCAFFOLDING FOR YOU TO OWN!
// NOTE: json tags are required.  Any new fields you add must have json tags for the fields to be serialized.

// PeerCerts defines the desired certificates for Peer
// +k8s:openapi-gen=true
type PeerCerts struct {
<<<<<<< Updated upstream
	Tls        struct {
		TLSKey     string `json:"tlsKey,omitempty"`
		TLSCert string `json:"tlsCert,omitempty"`
		TLSRootcert  string `json:"tlsRootcert,omitempty"`
	} `json:"tls"`

	Msp        struct {
		admincerts string `json:"adminCerts,required"`
		ConfigMapKey  string `json:"configMapKey,required"`
	} `json:"msp"`
=======
	TLSCerts *PeerTLSCerts `json:"tlsCerts"`
	Msp 	*MSPCerts `json:"msp"`
}

type PeerTLSCerts struct {
	TLSKey       string `json:"tlsKey,omitempty"`
	TLSCert 	 string `json:"tlsCert,omitempty"`
	TLSRootcert  string `json:"tlsRootcert,omitempty"`
>>>>>>> Stashed changes
}

// PeerSpec defines the desired state of Peer
// +k8s:openapi-gen=true
type PeerSpec struct {
	// INSERT ADDITIONAL SPEC FIELDS - desired state of cluster
	// Important: Run "operator-sdk generate k8s" to regenerate code after modifying this file
	// Add custom validation using kubebuilder tags: https://book-v1.book.kubebuilder.io/beyond_basics/generating_crd.html
	Certs         *PeerCerts `json:"certs,omitempty"`
	NodeSpec      `json:"nodeSpec,omitempty"`
}

// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object

// Peer is the Schema for the peers API
// +k8s:openapi-gen=true
// +kubebuilder:subresource:status
type Peer struct {
	metav1.TypeMeta   `json:",inline"`
	metav1.ObjectMeta `json:"metadata,omitempty"`

	Spec   PeerSpec   `json:"spec,omitempty"`
	Status NodeStatus `json:"status,omitempty"`
}

// +k8s:deepcopy-gen:interfaces=k8s.io/apimachinery/pkg/runtime.Object

// PeerList contains a list of Peer
type PeerList struct {
	metav1.TypeMeta `json:",inline"`
	metav1.ListMeta `json:"metadata,omitempty"`
	Items           []Peer `json:"items"`
}

func init() {
	SchemeBuilder.Register(&Peer{}, &PeerList{})
}
