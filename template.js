function Template(elem) {
    if (!elem) {
        throw new Error('No ID or element specified.');
    }
    
    if (!(elem instanceof HTMLElement)) {
        elem = document.getElementById(elem.replace(/^#/g, ''));
    }
    
    Object.freeze(elem);
    
    if (!('content' in elem)) {
        throw new Error('Template unsupported by the browser.');
    }
    
    let fieldElems = elem.content.querySelectorAll('[data-field]');
    
    let fields = {};
    let fieldVals = {};
    
    fieldElems.forEach(function (fieldElem) {
        //console.log(f);
        if (!fields[fieldElem.dataset.field]) {
            fields[fieldElem.dataset.field] = [];
        }
        
        fieldVals[fieldElem.dataset.field] = fieldElem.innerHTML;
        fields[fieldElem.dataset.field].push(fieldElem);
    });
    
    this.fields = new Proxy(fieldVals, {
        set: function (obj, prop, val) {
            //console.log(obj, prop, val);
            if (prop in fields) {
                fields[prop].forEach(function (f) {
                    f.innerHTML = val;
                });
                
                obj[prop] = val;
            }
        },
        get: function (obj, prop) {
            return obj[prop] || null;
        }
    });
    
    this.appendTo = function (parent = document.body) {
        if (!parent) {
            throw new Error('No parent element or parent ID specified.');
        }
    
        if (!(parent instanceof HTMLElement)) {
            parent = document.getElementById(parent.replace(/^#/g, ''));
        }

        parent.appendChild(elem.content.cloneNode(true));
    }
    
    this.prependTo = function (parent = document.body) {
        if (!parent) {
            throw new Error('No parent element or parent ID specified.');
        }
    
        if (!(parent instanceof HTMLElement)) {
            parent = document.getElementById(parent.replace(/^#/g, ''));
        }

        parent.prepend(elem.content.cloneNode(true));
    }
}
