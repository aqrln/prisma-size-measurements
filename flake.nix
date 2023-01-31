{
  description = "A very basic flake indeed";

  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages."${system}";
        inherit (pkgs) podman;
        runInContainer = (name: script:
          let scriptFile = pkgs.writeText "scriptFile" script; in
          pkgs.writeShellScriptBin name ''
            OUTDIR=$(mktemp -d)
            echo "#!/bin/bash" > $OUTDIR/script.sh
            cat ${scriptFile} >> $OUTDIR/script.sh
            chmod +x $OUTDIR/script.sh
            docker run --rm -it -v $OUTDIR:/root --entrypoint=bash docker.io/node:lts -c 'cd /root; echo "running the script"; ./script.sh'


            echo "=============================="
            echo "ℹ️  Output written to $OUTDIR"
            echo "=============================="
          '');
      in
      {
        packages.vanillaSize = runInContainer "vanillaSize" ''
          npm i prisma
          echo hi > out.txt
        '';

        packages = { inherit (pkgs) diskonaut; };
      });
}
