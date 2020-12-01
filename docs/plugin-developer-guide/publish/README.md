---
order: 9
---
# Publish a plugin

## With GitHub Actions
The template include a [GitHub Actions](https://github.com/features/actions) workflow in order to test.
Feel free to add any step to start containers for integration, deploy to artifactory, ...

## Publish on Bintray
The template also include a gradle task that will publish to [Bintray](https://bintray.com/) account. 

You only need export to env vars : 

- `BINTRAY_USER`: your bintray username
- `BINTRAY_KEY`: your bintray key.

You can customize the `build.gradle` to fit with your bintray account, the default one is the `kestra` account that you will not have any right to publish.

You can also add this step to publish to bintray on the `.github/workflows/main.yml` files: 

```yaml
      # Publish package
      - name: Publish package
        if: startsWith(github.ref, 'refs/tags/v') || github.ref == 'refs/heads/master'
        env:
          BINTRAY_USER: ${{ secrets.BINTRAY_USER }}
          BINTRAY_KEY: ${{ secrets.BINTRAY_KEY }}
        run: ./gradlew bintrayUpload --parallel --no-daemon
```

## To others artifact manager
Since Kestra plugins are a simple java app, you can customize the Github Actions and the gradle build to publish anywhere.
Just look at for your artifact gradle plugins and add this to both.
