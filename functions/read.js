const fs = require('fs');

const splits = {
    'SafeQuote': '[]:&#?.??.><![]][]!!!!Section-Safe_Quote',
    'SafeObjSplit': '[]:&#?.??.><![]][]!!!!Section-Safe_Obj_Split',
    'SafeSemiColon': '[]:&#?.??.><![][]!!!!Section-Safe_SemiColon',
}

function codeSanitizer(str) {
    return str
    .split('{').join('')
    .split('}').join('')
    .split('[').join('')
    .split(']').join('')
    .split('(').join('')
    .split(')').join('')
    .split('=>').join('')
    .split('function').join('')
    .split('eval').join('')
}

module.exports = (fn) => {
    if (fs.existsSync(fn)) {
        try {
            rawData = codeSanitizer(fs.readFileSync(fn, 'utf8').split('\r').join('').split('\t').join('').split('\n').join(''));
            sections = rawData.split(`\\;`).join(splits.SafeSemiColon).split(';');
            var validSections = [];
            var jsonBuilder = {};
            var resultObjs = [];
            for (i=0; i<sections.length; i++) {
                if (sections[i].length > 0) {
                    validSections.push(sections[i]);
                }
            }
            for (iii=0; iii<validSections.length; iii++) {
                sec = validSections[iii];
                var secSplit = sec.split(`\\"`).join(splits.SafeQuote).split(`\\;`).join(splits.SafeSemiColon).split('"~"').join(splits.SafeObjSplit).split('"').join('').split(splits.SafeObjSplit);
                if (secSplit[0].includes('~')) {
                    var lastKeyInDict = undefined;
                    var lastKeyInDictList = [];
                    for (i=0; i<secSplit[0].split('~').length; i++) {
                        var key = secSplit[0].split(splits.SafeSemiColon).join(';').split('~').reverse()[i];
                        var data = secSplit[0].split(splits.SafeSemiColon).join(';').split('~').reverse()[i+1];
                        if (data != undefined) {
                            if (lastKeyInDict == undefined) {
                                jsonBuilder[key] = data.split(splits.SafeSemiColon).join(';').split(splits.SafeQuote).join('"');
                            } else {
                                /*if (typeof jsonBuilder[lastKeyInDict] == 'string') {
                                    jsonBuilder[lastKeyInDict] = {}
                                } else if (typeof jsonBuilder[lastKeyInDict] == 'undefined') {
                                    jsonBuilder[lastKeyInDict] = {}
                                }*/
                                var evalBuilderList = [];
                                for (i=0; i<lastKeyInDictList.length; i++) {
                                    var evalBuilder = 'jsonBuilder';
                                    evalBuilderList.push(lastKeyInDictList[i].split(splits.SafeSemiColon).join(';').split(splits.SafeQuote).join('"'));
                                    for (j=0; j<evalBuilderList.length; j++) {
                                        evalBuilder += `['${evalBuilderList[j].split(splits.SafeSemiColon).join(';').split(splits.SafeQuote).join('"')}']`;
                                    }
                                    eval(evalBuilder + ` = {}`);
                                }
                                evalBuilder += `['${secSplit[0].split('~').reverse()[i].split(splits.SafeSemiColon).join(';').split(splits.SafeQuote).join('"')}']`;
                                eval(evalBuilder + ` = "${data.split(splits.SafeSemiColon).join(';').split(splits.SafeQuote).join('"')}"`);
                            }
                        }
                        lastKeyInDictList.push(key.split(splits.SafeSemiColon).join(';').split(splits.SafeQuote).join('"'));
                        lastKeyInDict = key.split(splits.SafeSemiColon).join(';').split(splits.SafeQuote).join('"');
                    }
                }
            }
            console.log(jsonBuilder)
            return dataFromFile;
        } catch (err) {
            //console.log(err)
            return undefined;
        }
    } else {
        return undefined;
    }
}