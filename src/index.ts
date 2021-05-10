import {app} from './app'
import {logger, PORT, HOME} from './const';
import * as fs from 'fs';

app.listen(PORT, () => {logger.info(`app listening on port ${PORT}`)});

app.get('/list', async (request, response) =>{
    logger.info('request: POST | route: list');

    const relPath = request.query.path;
    const PATH = relPath===undefined ? HOME as any + '' : HOME as any + relPath;
    const stat = fs.statSync(PATH);    

    stat.isDirectory()
        ?(
            fs.readdir(PATH, (err, dirent) => {
                if (err) return response.json({status: 404, dirent: null, path: relPath, isFile: false})
                const filtDirent = dirent.filter(dir => !dir.startsWith('.'))
                let obj=[]
                for (let dir of filtDirent){
                    fs.statSync(PATH+'/'+dir).isDirectory()
                        ? obj.push({name: dir, isFile: false, path: relPath+dir})
                        : obj.push({name: dir, isFile: true, path: relPath+dir})
                }
                return response.json({status: 200, dirent: obj, path: relPath, isFile: false})
            })
        ):(
            () => {return response.json({status:200, dirent: null, path: relPath, isFile: true})}
        )
});

const getStatFile = async (file: string) => {
    fs.stat(file, (err, stat) => {
        if (err) return err;
        else return stat;
    })
}