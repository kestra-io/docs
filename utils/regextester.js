const directiveRe = /^::collapse(?<attrs>\{[^}]*\})?\r?\n(?<content>[\s\S]*?)^\s*::\s*$/gm;

const text = `
# test value

:::collapse{attribute="attributeValue"}
content

:::`;

const m = directiveRe.exec(text);
if (m) {
  console.log(m.groups);
}