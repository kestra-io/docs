---
order: 9
---
# Publish a plugin

## With GitHub Actions
The template include a [GitHub Actions](https://github.com/features/actions) workflow in order to test.
Feel free to add any step to start containers for integration, deploy to artifactory, ...

## Publish on Maven Central
The template also include a Gradle task that will publish to [Maven Central](https://central.sonatype.org/pages/producers.html). You will need to register to Maven Central to be able to publish to it. 

You only need to configure the `gradle.properties` to have all required properties : 

```yaml
sonatypeUsername=
sonatypePassword=
signing.keyId=
signing.password=
signing.secretKeyRingFile=

```


There is a pre-configured GitHub Actions workflow in the `.github/workflows/main.yml` file that you can customize to your need:
```yaml
      # Publish
      - name: Publish package to Sonatype
        if: github.ref == 'refs/heads/master'
        env:
          ORG_GRADLE_PROJECT_sonatypeUsername: ${{ secrets.SONATYPE_USER }}
          ORG_GRADLE_PROJECT_sonatypePassword: ${{ secrets.SONATYPE_PASSWORD }}
          SONATYPE_GPG_KEYID: ${{ secrets.SONATYPE_GPG_KEYID }}
          SONATYPE_GPG_PASSWORD: ${{ secrets.SONATYPE_GPG_PASSWORD }}
          SONATYPE_GPG_FILE: ${{ secrets.SONATYPE_GPG_FILE }}
        run: |
          echo "signing.keyId=${SONATYPE_GPG_KEYID}" > ~/.gradle/gradle.properties
          echo "signing.password=${SONATYPE_GPG_PASSWORD}" >> ~/.gradle/gradle.properties
          echo "signing.secretKeyRingFile=${HOME}/.gradle/secring.gpg" >> ~/.gradle/gradle.properties
          echo ${SONATYPE_GPG_FILE} | base64 -d > ~/.gradle/secring.gpg
          ./gradlew publishToSonatype

      # Release
      - name: Release package to Maven Central
        if: startsWith(github.ref, 'refs/tags/v')
        env:
          ORG_GRADLE_PROJECT_sonatypeUsername: ${{ secrets.SONATYPE_USER }}
          ORG_GRADLE_PROJECT_sonatypePassword: ${{ secrets.SONATYPE_PASSWORD }}
          SONATYPE_GPG_KEYID: ${{ secrets.SONATYPE_GPG_KEYID }}
          SONATYPE_GPG_PASSWORD: ${{ secrets.SONATYPE_GPG_PASSWORD }}
          SONATYPE_GPG_FILE: ${{ secrets.SONATYPE_GPG_FILE }}
        run: |
          echo "signing.keyId=${SONATYPE_GPG_KEYID}" > ~/.gradle/gradle.properties
          echo "signing.password=${SONATYPE_GPG_PASSWORD}" >> ~/.gradle/gradle.properties
          echo "signing.secretKeyRingFile=${HOME}/.gradle/secring.gpg" >> ~/.gradle/gradle.properties
          echo ${SONATYPE_GPG_FILE} | base64 -d > ~/.gradle/secring.gpg
          ./gradlew publishToSonatype closeAndReleaseSonatypeStagingRepository
```

