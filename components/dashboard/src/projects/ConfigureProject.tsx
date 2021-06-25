/**
 * Copyright (c) 2021 Gitpod GmbH. All rights reserved.
 * Licensed under the GNU Affero General Public License (AGPL).
 * See License-AGPL.txt in the project root for license information.
 */

import React, { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
// import { CreateWorkspaceMode, WorkspaceCreationResult } from "@gitpod/gitpod-protocol";
// import { useLocation, useRouteMatch } from "react-router";
import TabMenuItem from "../components/TabMenuItem";
// import CreateWorkspace from "../start/CreateWorkspace";

export default function () {
  // const location = useLocation();
  // const match = useRouteMatch<{ team: string, resource: string }>("/:team/:resource");

  // const [ workspaceCreationResult, setWorkspaceCreationResult ] = useState<WorkspaceCreationResult | undefined>();
  const [ gitpodYml, setGitpodYml ] = useState<string>('');
  const [ gitpodDockerfile, setGitpodDockerfile ] = useState<string>('');
  const [ selectedTab, setSelectedTab ] = useState<'.gitpod.yml'|'.gitpod.Dockerfile'>('.gitpod.yml');
  const [ contextUrl, setContextUrl ] = useState<string|undefined>();
  // const [ project, setProject ] = useState<ProjectInfo | undefined>();

  const buildProject = async (event: React.MouseEvent) => {
    (event.target as HTMLButtonElement).disabled = true;
    if (!!contextUrl) {
      setContextUrl(undefined);
    }
    // const result = await getGitpodService().server.createWorkspace({
    //   contextUrl: `additionalcontent/${btoa(JSON.stringify(config))}/https://github.com/jankeromnes/test`,
    //   mode: CreateWorkspaceMode.ForceNew,
    // });
    // setWorkspaceCreationResult(result);
    const config: { '.gitpod.yml': string, '.gitpod.Dockerfile'?: string } = {
      '.gitpod.yml': gitpodYml
    };
    if (!!gitpodDockerfile) {
      config['.gitpod.Dockerfile'] = gitpodDockerfile;
    }
    setContextUrl(`additionalcontent/${btoa(JSON.stringify(config))}/https://github.com/jankeromnes/test`);
  }

  return <div className="flex flex-col mt-24 mx-auto items-center">
    <h1>Configure Project</h1>
    <p className="text-gray-500 text-center text-base">Fully-automate your project's dev setup. <a className="learn-more" href="https://www.gitpod.io/docs/references/gitpod-yml">Learn more</a></p>
    <div className="mt-4 w-full flex">
      <div className="flex-1 m-8">
        <div className="flex justify-center border-b border-gray-200 dark:border-gray-800">
          <TabMenuItem name=".gitpod.yml" selected={selectedTab === '.gitpod.yml'} onClick={() => setSelectedTab('.gitpod.yml')} />
          <TabMenuItem name=".gitpod.Dockerfile" selected={selectedTab === '.gitpod.Dockerfile'} onClick={() => setSelectedTab('.gitpod.Dockerfile')} />
        </div>
        {selectedTab === '.gitpod.yml' &&
          <Editor classes="mt-4 w-full h-96" value={gitpodYml} language="yaml" onChange={setGitpodYml} />}
        {selectedTab === '.gitpod.Dockerfile' &&
          <Editor classes="mt-4 w-full h-96" value={gitpodDockerfile} language="dockerfile" onChange={setGitpodDockerfile} />}
        <div className="flex justify-center">
          <button className="mt-2" onClick={buildProject}>Build</button>
        </div>
      </div>
      <div className="flex-1 m-8">
        <h3 className="text-center">Docker Build / Prebuild</h3>
        {!!contextUrl &&
          // <CreateWorkspace contextUrl={contextUrl} />}
          <iframe className="mt-4 w-full h-96" src={`/#${contextUrl}`} />
        }
        <div className="flex justify-center">
          <button className="mt-2 secondary disabled" disabled={true}>Start Workspace</button>
        </div>
      </div>
    </div>
  </div>;
}

function Editor(props: { value: string, language: string, onChange: (value: string) => void, classes: string }) {
  const monacoContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (monacoContainerRef.current) {
      const editor = monaco.editor.create(monacoContainerRef.current, {
        value: props.value,
        language: props.language,
        minimap: {
          enabled: false,
        },
        renderLineHighlight: 'none',
      });
      editor.onDidChangeModelContent(() => {
        props.onChange(editor.getValue());
      })
    }
  }, []);
  return <div className={props.classes} ref={monacoContainerRef} />;
}