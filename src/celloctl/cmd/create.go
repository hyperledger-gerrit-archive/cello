/*
Copyright IBM Corp. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0
*/
package cmd

import (
	"github.com/celloctl/internal"
	"github.com/celloctl/model"
	"github.com/spf13/cobra"
	"gopkg.in/yaml.v2"
	"io/ioutil"
)

var file string

var createCmd = &cobra.Command{
	Use:   "create",
	Short: "Create resource in cell service",
	Long: `Create resource in cello service,
			supported kind: Agent`,
	Run: func(cmd *cobra.Command, args []string) {
		source, err := ioutil.ReadFile(file)
		if err != nil {
			panic(err)
		}
		var config model.Config
		err = yaml.Unmarshal(source, &config)
		if err != nil {
			panic(err)
		}
		switch config.Kind {
		case "Agent":
			err := internal.CreateAgent(source)
			if err != nil {
				panic(err)
			}
			break
		case "Organization":
			err := internal.CreateOrganization(source)
			if err != nil {
				panic(err)
			}
			break
		case "Node":
			err := internal.CreateNode(source)
			if err != nil {
				panic(err)
			}
			break
		default:
			break
		}
	},
}

func init() {
	RootCmd.AddCommand(createCmd)

	createCmd.Flags().StringVarP(&file, "file", "f", "", "yaml file for create")
	err := createCmd.MarkFlagRequired("file")
	if err != nil {
		panic(err)
	}
}
