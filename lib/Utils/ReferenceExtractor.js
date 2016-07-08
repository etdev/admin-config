export default {
    flatten(list) {
      list => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [])
    },
    getReferencedLists(fields) {
        return this.indexByName(fields.filter(f => f.type() === 'referenced_list'));
    },
    getReferences(fields, withRemoteComplete, optimized = null) {
        let references = fields.filter(f => {
          if (f.type() === 'embedded_list') {
            return (getReferences(f.targetFields(), withRemoteComplete));
          } else {
            f.type() === 'reference' || f.type() === 'reference_many'
          }
        });
        if (withRemoteComplete === true) {
            references = references.filter(r => r.remoteComplete());
        } else if (withRemoteComplete === false) {
            references = references.filter(r => !r.remoteComplete());
        }
        if (optimized !== null) {
            references = references.filter(r => r.hasSingleApiCall() === optimized)
        }
        return this.indexByName(references);
    },
    getNonOptimizedReferences(fields, withRemoteComplete) {
        return this.getReferences(fields, withRemoteComplete, false);
    },
    getOptimizedReferences(fields, withRemoteComplete) {
        return this.getReferences(fields, withRemoteComplete, true);
    },
    indexByName(references) {
        return references.reduce((referencesByName, reference) => {
            referencesByName[reference.name()] = reference;
            return referencesByName;
        }, {});
    }
};

/*
var references = fields.filter(function (f) {
		
		           	if (f.type() === 'embedded_list') {
		           	//	console.log("FOUND EMBEDDED LIST")
		           		return getReferences(f.targetFields(), withRemoteComplete);
		           		//debugger;
		           	//	return f.type() === 'reference' || f.type() === 'reference_many';
		           	} else {
		           		return f.type() === 'reference' || f.type() === 'reference_many';
		           	}
		            
		        });
*/
