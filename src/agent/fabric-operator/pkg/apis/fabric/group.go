// Package fabric contains fabric API versions.
//
// This file ensures Go source parsers acknowledge the fabric package
// and any child packages. It can be removed if any other Go source files are
// added to this package.
package fabric

import (
	"io/ioutil"

	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apimachinery/pkg/runtime/schema"
	"k8s.io/client-go/kubernetes/scheme"
)

var (
	// TemplateRoot is the root directory where all needed templates live
	TemplateRootDir = "/usr/local/bin/templates/"
)

func GetObjectFromTemplate(templateName string) (runtime.Object, *schema.GroupVersionKind, error) {
	template, _ := ioutil.ReadFile(TemplateRootDir + templateName)
	decode := scheme.Codecs.UniversalDeserializer().Decode

	return decode(template, nil, nil)
}
