import request from '@/utils/request'

export async function fetchList(path,page,pass) {
    if(pass)return fetchWithPass(pass,path,page);
    return request({
        url: path,
        method: 'get',
        params: {page},
        headers: {accept: 'application/json'}
    });
}

async function fetchWithPass(pass,path,page){
    return request({
        url:path,
        method:'post',
        params: {page},
        data:{password:pass},
        headers:{accept:'application/json'}
    })
}