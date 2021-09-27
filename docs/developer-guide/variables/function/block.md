

# `block`
The `block` function is used to render the contents of a block more than once. It is not to be confused
with the block *tag* which is used to declare blocks.

The following example will render the contents of the "post" block twice; once where it was declared
and again using the `block` function:
```twig
{% block "post" %} content {% endblock %}

{{ block("post") }}
```
The above example will output the following:
```twig
content

content
```
