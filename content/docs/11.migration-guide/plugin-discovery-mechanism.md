---
title: Plugin Discovery Mechanism
icon: /docs/icons/migration-guide.svg
release: 0.17.0
---

Kestra 0.17.0 uses a new mechanism to discover and load plugins. If you use custom plugins, follow this guide to make the necessary adjustments.

Plugins are now discovered and loaded using the standard *Java Service Loader*.

## Why the Change?

So far, Kestra heavily relied on the _Bean Introspection_ mechanism provided by the Micronaut Framework for loading plugins (_Micronaut is the JVM-based API framework used by Kestra_).

However, we have repeatedly encountered some limitations in maintaining the backward compatibility of plugins during major version upgrades of Micronaut. In addition, this implementation was limiting our ability to introduce future enhancements around the plugin mechanism.

Thanks to this new implementation, we reduced the number of dependencies required for developing custom plugins, and these plugins now load twice as fast as before.

Finally, this change is part of a wider effort to improve the developer experience around plugins, and to reduce Micronaut's exposure outside the Kestra core.

Unfortunately, we've had to introduce some minor breaking-changes to the way custom plugins should be built.

Below are the changes required to migrate to Kestra 0.17.0.

## Micronaut Dependencies

For most plugin implementations, all Micronaut libs can be removed from the `compileOnly` dependencies in the `build.gradle` file.

However, Micronaut is still required to use the utility classes provided by Kestra for running unit-tests.

## Kestra's Annotation Processor

Kestra requires a new annotation processor to be configured in the `build.gradle` file of your project (or `pom.xml` for Maven).

```
annotationProcessor group: "io.kestra", name: "processor", version: kestraVersion
```

The role of this processor is to automatically manage the `META-INF/services` file needed by Java to discover your plugins.

## Custom Validators

Kestra allows you to develop a custom constraint validator using the standard Java API for bean validation (i.e., JSR-380), which is used to validate the properties of custom tasks.

::alert{type="warning"}
The custom validator must now implement the standard `jakarta.validation.ConstraintValidator` instead of the interface provided by Micronaut: `io.micronaut.validation.validator.constraints.ConstraintValidator`.
::

In addition, custom validation annotation should now strictly adhere to the Java bean specification — see the example below.

Kestra 0.16.6 and before:

```java
// file: io.kestra.plugins.custom.CustomNotEmpty.java
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = CustomNotEmptyValidator.class)
public @interface CustomNotEmpty {
    String message() default "invalid";
}
```

```java
// file: io.kestra.plugins.custom.CustomNotEmptyValidator.java
import io.micronaut.validation.validator.constraints.ConstraintValidator;
import io.micronaut.validation.validator.constraints.ConstraintValidatorContext;
// ...
@Singleton
@Introspected
public class CustomNotEmptyValidator implements ConstraintValidator<CustomNotEmpty, String> {
    @Override
    public boolean isValid(
        @Nullable String value,
        @NonNull AnnotationValue<CustomNotEmpty> annotationMetadata,
        @NonNull ConstraintValidatorContext context) {
        if (value == null) {
            return true; // nulls are allowed according to spec
        } else if (value.size() < 2) {
            context.messageTemplate("string must have at-least two characters");
            return false;
        } else {
            return true;
        }
    }
}
```

Kestra 0.17.0 and later:

```java
// file: io.kestra.plugins.custom.CustomNotEmpty.java
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = CustomNotEmptyValidator.class)
public @interface CustomNotEmpty {
    String message() default "invalid";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
```

```java
// file: io.kestra.plugins.custom.CustomNotEmptyValidator.java
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
// ...
@Singleton
@Introspected
public class CustomNotEmptyValidator implements ConstraintValidator<CustomNotEmpty, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true; // nulls are allowed according to spec
        } else if (value.size() < 2) {
            context.disableDefaultConstraintViolation();
            context
                .buildConstraintViolationWithTemplate("string must have at-least two characters")
                .addConstraintViolation();
            context.messageTemplate();
            return false;
        } else {
            return true;
        }
    }
}
```