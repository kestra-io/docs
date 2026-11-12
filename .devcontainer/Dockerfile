FROM node:26

ARG DEBIAN_FRONTEND=noninteractive

# System packages are installed as root; the container then runs as the
# node image's non-root "node" user (uid 1000).
USER root

RUN apt update && apt install -y \
  apt-transport-https ca-certificates gnupg lsb-release iputils-ping net-tools \
  curl wget git zip unzip less zsh jq lsof ripgrep

ARG USERNAME=node
RUN chsh -s /bin/zsh ${USERNAME}

USER ${USERNAME}
ENV HOME="/home/${USERNAME}"
WORKDIR ${HOME}

# --------------------------------------
# Git
# --------------------------------------
# Need to add the devcontainer workspace folder as a safe directory to enable git 
# version control system to be enabled in the containers file system.
RUN git config --global --add safe.directory "/workspaces/docs"
# --------------------------------------

# --------------------------------------
# Oh my zsh
# --------------------------------------
RUN sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" -- \
  --unattended

ENV SHELL=/bin/zsh
# --------------------------------------

# --------------------------------------
# SSH 
# --------------------------------------
RUN mkdir -p -m 700 ~/.ssh
RUN touch ~/.ssh/config
RUN echo "Host github.com" >> ~/.ssh/config \
  && echo "    IdentityFile ~/.ssh/id_ed25519" >> ~/.ssh/config
RUN touch ~/.ssh/id_ed25519
# --------------------------------------
