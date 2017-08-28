;'use strict';

const fs = require('fs'),
      path = require('path');

function __preprocessPath(sPath){
    if( !fs.lstatSync(sPath).isDirectory() ){
        throw new Error(sPath + ' is not a directory');
    }
    return sPath.slice(-1)==='/' ? sPath : sPath+'/'
}
/*
 * Search all filenames in a directory
 *
 * @para sPath     Search all filenames in sPath and its all descendant directories
 * @sExtension     Only filename with extension of sExtension will be found
 * @sSearchSubstr  Only filename contain sSearchSubstr will be found
 *
 * Case-insensitive
 * FIXME:
 *      1. Too much repetitive codes
 */
let searchFilenames_aFilenames = []; // all filenames found
function searchFilenames(sPath='./', sExtension='', sSearchSubstr=''){
    sExtension = sExtension.toLowerCase();
    sSearchSubstr = sSearchSubstr.toLowerCase();

    sPath = __preprocessPath(sPath);

    let aResult = [], // all directories in current directory
        aNames = fs.readdirSync(sPath); // all names in current directory

    aNames.forEach((item)=>{
        if( fs.lstatSync(sPath+'/'+item).isDirectory() ){ // this name is directory
            // into inner directory
            aResult.push( searchFilenames(sPath+item+'/', sExtension, sSearchSubstr) );
        }
        else{
            if(sExtension){
                if(path.extname(item).slice(1).toLowerCase() === sExtension){
                    if(sSearchSubstr){
                        if(item.toLowerCase().includes(sSearchSubstr)){
                            searchFilenames_aFilenames.push(sPath+item);
                        }
                    }
                    else{
                        searchFilenames_aFilenames.push(sPath+item);
                    }
                }
            }
            else{
                if(sSearchSubstr){
                    if(item.toLowerCase().includes(sSearchSubstr)){
                        searchFilenames_aFilenames.push(sPath+item);
                    }
                }
                else{
                    searchFilenames_aFilenames.push(sPath+item);
                }
            }
        }
    });
    return searchFilenames_aFilenames;
}



/*
 * Put all filenames of a directory itself(just one level) in a newly created filenames.txt
 */
function getFilenames(sPath='./', bWithExtension=false){
    sPath = __preprocessPath(sPath);

    let aNames = fs.readdirSync(sPath);
    aNames.forEach((name)=>{
        if(!bWithExtension){
            name = name.slice(0, name.indexOf('.'));
        }
        fs.appendFile(sPath + 'filenames.txt', name + '\r\n');
    });
}

/*
 * Index-rename all files in a directory itself(just one level) from a start number
 */
function indexRenameFiles(sPath, nStart=0){
    sPath = __preprocessPath(sPath);

    if( typeof nStart !== 'number' || Math.floor(Math.abs(nStart)) !== nStart){
        throw new Error('nStart must be a non-negative integer');
    }

    searchFilenames(sPath).forEach((name,index)=>{
        fs.renameSync(name, sPath+(index+nStart)+'.'+path.extname(name) );
    });
}


module.exports = {
    searchFilenames,
    getFilenames,
    indexRenameFiles,
};
