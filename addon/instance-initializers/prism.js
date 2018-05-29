export function initialize(owner) {
  const document = owner.lookup('service:-document');

  document.body.querySelectorAll = function() {
    return document.body;
  };

  console.log(document.body);
  Prism.highlightAllUnder(document.body);
}

export default {
  initialize
};
