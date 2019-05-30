# **********************************************************************************************************************
# Copyright  Tomas Inc., 2018.
# All Rights Reserved.
#
# Usage:
#   docker build -t <image_name> --build-arg branch_name=<branch_name> .
# **********************************************************************************************************************
FROM jenkinsci/blueocean

# update dpkg repositories
USER root
RUN apk update
RUN apk add nodejs
