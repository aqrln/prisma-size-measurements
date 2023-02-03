{
  description = "A very basic flake indeed";

  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages."${system}";
        packageString = "prisma@4.9.0";

        runInContainer = (name: script:
          let scriptFile = pkgs.writeText "scriptFile" script; in
          pkgs.writeShellScriptBin name ''
            OUTDIR=$(mktemp -d)
            echo "#!/bin/bash" > $OUTDIR/script.sh
            cat ${scriptFile} >> $OUTDIR/script.sh
            chmod +x $OUTDIR/script.sh
            docker run --rm -it -v /nix:/nix -v $OUTDIR:/root --entrypoint=bash docker.io/node:lts -c 'cd /root; echo "running the script"; ./script.sh'


            echo "=============================="
            echo "ℹ️  Output written to $OUTDIR"
            echo "=============================="
          '');
      in
      {
        packages = {
          vanillaSize = runInContainer "vanillaSize" ''
            npm i ${packageString}
          '';

          smallVanillaPrismaClient = runInContainer "vanillaSize" ''
            npm i ${packageString}
            cp ${./small_schema.prisma} schema.prisma
            cat << EOF >> schema.prisma
              generator jsclient {
                provider = "prisma-client-js"
              }
            EOF
            npx ${packageString} generate
          '';

          largeVanillaPrismaClient = runInContainer "vanillaSize" ''
            npm i ${packageString}
            cp ${./large_schema.prisma} schema.prisma
            cat << EOF >> schema.prisma
              generator jsclient {
                provider = "prisma-client-js"
              }
            EOF
            npx ${packageString} generate
          '';

          smallEdgePrismaClient = runInContainer "vanillaSize" ''
            npm i ${packageString}
            cp ${./small_schema.prisma} schema.prisma
            cat << EOF >> schema.prisma
              generator jsclient {
                provider = "prisma-client-js"
              }
            EOF
            npx ${packageString} generate --data-proxy
          '';

          largeEdgePrismaClient = runInContainer "vanillaSize" ''
            npm i ${packageString}
            cp ${./large_schema.prisma} schema.prisma
            cat << EOF >> schema.prisma
              generator jsclient {
                provider = "prisma-client-js"
              }
            EOF
            npx ${packageString} generate --data-proxy
          '';


          # last step:
          # aws lambda update-function-code --function-name cold-start-test --zip-file "fileb://lambda-app.zip"
          awsZip = pkgs.writeShellScriptBin "awsZip" ''
            docker run --rm -it -v /nix:/nix -v ./lambda-app:/home --entrypoint=bash docker.io/node:lts -c 'cd /home; npm i; npx prisma generate'
            pushd lambda-app
            : Delete the local binaries
            find node_modules -name 'libquery*debian*' -delete
            : Delete the CLI
            rm -rf node_modules/prisma
            rm lambda-app.zip
            ${pkgs.zip}/bin/zip -r lambda-app.zip .
            popd
          '';

          inherit (pkgs) diskonaut;
        };
      });
}
