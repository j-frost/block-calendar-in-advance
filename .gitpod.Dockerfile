FROM gitpod/workspace-full

RUN bash -c "npm install --global @google/clasp"

# Set ~/.clasprc based on user-provided env var
RUN echo ". /workspace/block-calendar-in-advance/scripts/setup-clasprc.sh" >> ~/.bashrc

# Set .clasp.json based on user-provided env var
RUN echo ". /workspace/block-calendar-in-advance/scripts/setup-claspjson.sh" >> ~/.bashrc
