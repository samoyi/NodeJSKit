"use strict";

const fs = require("fs"),
    path = require('path');

const gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'), // 执行 uglify 任务是如果发现错误可以显示错误位置
    babel = require('gulp-babel');



// minify JS file
gulp.task('uglify', function(){
    gulp.src('src/this.js')
        .pipe(babel({presets: ['env']}))
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('dest/this'));
});


// 从0开始对 indexRenamePic 文件夹中的文件以序号重命名
// 使用时要保证indexRenamePic文件夹中只有待重命名的文件
gulp.task('indexrename', function(){
    let aNames = fs.readdirSync('tools/indexRename/'),
        nFolderIndex = aNames.indexOf('renamed'),
        sExt = '';
    if(nFolderIndex===-1){
        fs.mkdirSync('tools/indexRename/renamed/');
    }
    else{
        aNames.splice(nFolderIndex, 1);
    }
    aNames.forEach((name, index)=>{
        sExt = path.extname(name);
        fs.copyFileSync('tools/indexRename/'+name, 'tools/indexRename/renamed/'+index+ sExt);
    });
});


// 获得 filenames 文件夹里所有文件的名字，生成 names.txt 文件中并写入获得的文件名
// exclude extension
gulp.task('filenames', function(){
    let aNames = fs.readdirSync('tools/filenames/');
    aNames.forEach((name)=>{
        let sNameWithoutExt = name.slice(0, name.indexOf('.'));
        fs.appendFile('tools/filenames/names.txt', sNameWithoutExt + '\r\n');
    });
});
// include extension
gulp.task('filenames_ext', function(){
    let aNames = fs.readdirSync('tools/filenames/');
    aNames.forEach((name)=>{
        fs.appendFile('tools/filenames/names_ext.txt', name + '\r\n');
    });
});


// Classify by extension
gulp.task('classifbyext', function(){
    let aNames = fs.readdirSync('tools/classifyByExt/'),
        aExt = [],
        sExt = '';
    aNames.forEach((name)=>{
        sExt = path.extname(name).slice(1);
        if(sExt){ // path.extname() can't get extension of those like .gitignore, will return ''
            if( aExt.includes(sExt) ){
                fs.renameSync('tools/classifyByExt/' +name, 'tools/classifyByExt/' +sExt+ '/' + name);
            }
            else{
                aExt.push(sExt);
                fs.mkdirSync('tools/classifyByExt/'+sExt);
                fs.renameSync('tools/classifyByExt/' +name, 'tools/classifyByExt/' +sExt+ '/' + name);
            }
        }
    });
});


// gulp.task('default',function(){
//     gulp.watch('src/this.html',['htmlmin']);
//     gulp.watch('src/this.scss',['sass']);
//     gulp.watch('src/this.js',['uglify']);
// });
