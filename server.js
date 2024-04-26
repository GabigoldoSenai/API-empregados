import http from "http";
import fs from "fs";
import { json } from "stream/consumers";

const PORT = 3333;

const server = http.createServer((request, response) => {
  const { url, method } = request;

  fs.readFile("empregados.json", "utf8", (err, data) => {
    if (err) {
      response.writeHead(500, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ message: "Erro interno do servidor" }));
      return;
    }

    let jsonData = [];
    try {
      jsonData = JSON.parse(data);
    } catch (error) {
      console.error("Erro ao analisar JSON:", error);
    }

    if (url === "/empregados" && method === "GET") {
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify(jsonData));
    } else if (url === "/empregados" && method === "POST") {
     
      let body = "";
      request.on("data", (chunk) => {
        body += chunk.toString();
      });
      request.on("end", () => {
        const newItem = JSON.parse(body);
        newItem.id = jsonData.length + 1; // Gerar um novo ID
        jsonData.push(newItem);
        fs.writeFile(
          "empregados.json",
          JSON.stringify(jsonData, null, 2),
          (err) => {
            if (err) {
              response.writeHead(500, { "Content-Type": "application/json" });
              response.end(
                JSON.stringify({ message: "Erro interno do servidor" })
              );
              return;
            }
            response.writeHead(201, { "Content-Type": "application/json" });
            response.end(JSON.stringify(newItem));
          }
        );
      });
    } else if (url === "/empregados/count" && method === "GET") {
      response.writeHead(200, { "Content-Type": "application/json" });

      response.end(
        JSON.stringify({ count: (jsonData.length) })
      );
    } else if (url.startsWith("/empregados/porCargo/") && method === "GET") {
      const role = (url.split("/")[3]).toLowerCase();
      const foundUsers = jsonData.filter((e) => {
        if(e.cargo.includes(role)){
          return e
        }
      })

      response.writeHead(200, { "Content-Type": "application/json" });

      response.end(
        JSON.stringify(foundUsers)
      );
    } else if (url.startsWith("/empregados/porHabilidade/") && method === "GET") {
      const skill = (url.split("/")[3]).toLowerCase();
      const userSkills = jsonData.filter((e) => {
        if(e.habilidades.includes(skill)){
          return e
        }
      })

      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(
        JSON.stringify(userSkills)
      );
    } else if (url.startsWith("/empregados/porFaixaSalarial") && method === "GET") {
      const minValue = url.searchParams.get("min")
      const maxValue = url.searchParams.get("man")
      const userSalary = jsonData.filter((e) => {
        if(e.salario >= minValue && e.salario <= maxValue){
          return e
        }
      })

      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(
        JSON.stringify(minValue)
      );
    } else if (url.startsWith("/empregados/") && method === "PUT") {
      
        const id = parseInt(url.split("/")[2]); 
        let body = "";
        request.on("data", (chunk) => {
          body += chunk.toString();
        });
        request.on("end", () => {
          const updatedItem = JSON.parse(body);
          // Procurar o livro pelo ID e atualizar seus dados
          const index = jsonData.findIndex((item) => item.id === Number(id));
          if (index !== -1) {
            jsonData[index] = { ...jsonData[index], ...updatedItem };
            fs.writeFile(
              "empregados.json",
              JSON.stringify(jsonData, null, 2),
              (err) => {
                if (err) {
                  response.writeHead(500, { "Content-Type": "application/json" });
                  response.end(
                    JSON.stringify({ message: "Erro interno do servidor" })
                  );
                  return;
                }
                response.writeHead(200, { "Content-Type": "application/json" });
                response.end(JSON.stringify(jsonData[index]));
              }
            );
          } else {
            response.writeHead(404, { "Content-Type": "application/json" });
            response.end(JSON.stringify({ message: "Livro não encontrado" }));
          }
        });
    } else if (url.startsWith("/empregados/") && method === "DELETE") {
        
        const id = parseInt(url.split("/")[2]); 
        const index = jsonData.findIndex((item) => item.id === id);
        if (index !== -1) {
          jsonData.splice(index, 1);
          fs.writeFile(
            "empregados.json",
            JSON.stringify(jsonData, null, 2),
            (err) => {
              if (err) {
                response.writeHead(500, { "Content-Type": "application/json" });
                response.end(
                  JSON.stringify({ message: "Erro interno do servidor" })
                );
                return;
              }
              response.writeHead(200, { "Content-Type": "application/json" });
              response.end(
                JSON.stringify({ message: "Livro removido com sucesso" })
              );
            }
          );
        } else {
          response.writeHead(404, { "Content-Type": "application/json" });
          response.end(JSON.stringify({ message: "Livro não encontrado" }));
        }
    } else if (url.startsWith("/empregados/") && method === "GET") {
        const userID = url.split("/")[2]
        const userFound = jsonData.find(user => userID == user.id)

        response.writeHead(200, { "Content-Type": "application/json" });
        response.end(JSON.stringify(userFound));
   
    }else {
      response.writeHead(404, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ message: "Rota não encontrada" }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor on PORT: http://localhost:${PORT}`);
});
