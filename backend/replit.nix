{ pkgs }: {
  deps = [
    pkgs.python311Full
    pkgs.fastapi
    pkgs.uvicorn
    pkgs.pip
  ];
}