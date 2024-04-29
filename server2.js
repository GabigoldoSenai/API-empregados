import http from 'node:http'
import fs from 'node:fs'

const PORT = 3333 
let jsonData =[]

const server = http.createServer((req,res) => {
    const {method, url} = req

    const lerArquivo = (fileName) => {
        fs.readFile(fileName, 'utf8', (err, data) => {
            if(err){
                respostaJSON(500, {message : 'Erro ao buscar os dados'})
            }
    
            try{
                return jsonData = JSON.parse(data)
            } catch (error){
                return console.error('Erro ao ler o arquivo jsonData ' + error)
            }
        })
    }

    const respostaJSON = (status, message) => {
        res.writeHead(status, {'Content-Type' : 'application/json'})
        res.end(JSON.stringify(message))
    }

    if(method === 'GET' && url === '/empregados'){
            lerArquivo('empregados.json')
            respostaJSON(200, jsonData)
            
    }   else if(method === 'GET' && url === '/empregados/count'){
            respostaJSON(200, {count: jsonData.length})

    }else if(method ==='GET' && url.startsWith('/empregados/porCargo')){
            
            respostaJSON(200, 'funcionando')

    }else if(method ==='GET' && url.startsWith( '/empregadosporHabilidade')){
            respostaJSON(200, 'funcionando')

    }else if(method ==='GET' && url.startsWith( '/empregadosporFaixaSalarial')){
            respostaJSON(200, 'funcionando')

    }   else if(method ==='GET' && url.startsWith('/empregados/')){
        const userID = paseInt(url.split("/")[2])
        const userFound = jsonData.find(user => userID == user.id)

        userFound ? respostaJSON(200, userFound) : respostaJSON(200, {message: `Usuário de id ${userID} não encontrado`})
        
        
    }else if(method ==='POST' && url.startsWith('/empregados/')){
        let body = ''
        req.on('data', (chunk) => {
            body += chunk.toString()
        }) 
        req.on('end', () => {
            const newUser = JSON.parse(body)
            newUser.id = jsonData.length + 1
            jsonData.push(newUser)
            fs.writeFile(
                'empregados.json',
                JSON.stringify(jsonData, null, 2),
                (err) => {
                    if(err){
                        respostaJSON(500, {message: 'Erro interno do servidor'})
                    }

                    jsonData = JSON.parse(data)
                }
            )
        })
        
        respostaJSON(200, 'funcionando')

    }else if(method ==='PUT' && url.startsWith('/empregados/')){
            respostaJSON(200, 'funcionando')

    }else if(method ==='DELETE' && url.startsWith('/empregados/')){
            respostaJSON(200, 'funcionando')

    }   else{
            respostaJSON(404, {message: 'Rota não encontrada'})
    }

})

server.listen(PORT , () => {
    console.log('🐵 | Servidor rodando em: http://localhost:'+ PORT )
})