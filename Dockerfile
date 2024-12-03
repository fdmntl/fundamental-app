FROM node:latest AS apk

RUN npm install

RUN cd android/

CMD ["./gradlew", "assembleRelease"]

FROM node:latest

RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

ENV ANDROID_SDK_ROOT=/usr/local/android-sdk
ENV PATH=${PATH}:${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/platform-tools

RUN mkdir -p ${ANDROID_SDK_ROOT}/cmdline-tools/latest
RUN cd ${ANDROID_SDK_ROOT}/cmdline-tools/latest && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-7583922_latest.zip -O commandlinetools.zip
RUN cd ${ANDROID_SDK_ROOT}/cmdline-tools/latest && \
    unzip commandlinetools.zip
RUN cd ${ANDROID_SDK_ROOT}/cmdline-tools/latest && \
    rm commandlinetools.zip
RUN cd ${ANDROID_SDK_ROOT}/cmdline-tools/latest && \
    mv cmdline-tools/* . && \
    rmdir cmdline-tools

RUN chmod +x ${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin/sdkmanager

RUN yes | ${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin/sdkmanager --licenses
RUN ${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin/sdkmanager "platform-tools" "platforms;android-30"

RUN ${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin/sdkmanager "platform-tools"

EXPOSE 5037

COPY . .

COPY start.sh /usr/src/app/start.sh

RUN chmod +x /usr/src/app/start.sh

RUN npm install

EXPOSE 8081

CMD ["/usr/src/app/start.sh"]