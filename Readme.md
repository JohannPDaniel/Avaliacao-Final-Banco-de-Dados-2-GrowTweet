# GrowTweet - Avaliação final Banco de Dados 2

Seja bem-vindo ao projeto back-end do GrowTweet — uma mídia social baseada no Twitter.

### Funcionalidades
Este projeto permite:

- `Usuários`: Criação, visualização por consulta, visualização pelo ID, atualização e remoção de um usuário.

- `Tweets`: Criação, visualização por consulta, visualização pelo ID, atualização e remoção de um tweet (mensagem de um usuário).

- `Likes`: Criação e remoção de um like (curtida de um usuário em um tweet de outro usuário).

- `Replies`: Criação, visualização por consulta, visualização pelo ID, atualização e remoção de um reply (resposta de um usuário a um tweet de outro usuário).

- `Followers`: Criação e remoção de um seguidor (seguimento de um usuário por outro).

<h2 align=Center>Passos para executar o projeto</h2>

1º Criar o arquivo `.env` na raiz do projeto

2º No arquivo `.env`, configure as variáveis:

- `PORT`: Porta em que o servidor será executado.
- `DATABASE_URL`: URL de conexão com o banco de dados.
- `BCRYPT_SALT`: Número de rounds para o salt do bcrypt usado na hash de senha.

Exemplo de `.env`:

```bash
PORT="number"
DATABASE_URL="string"
BCRYPT_SALT="number"
```

3º Instale as dependências do projeto

```bash
npm install
```

4º Execute o seguinte comando para aplicar as migrações e configurar o banco de dados:

```bash
npx prisma migrate dev
```

5º Gere as tipagens para garantir que o Prisma esteja atualizado com o sistema:

```bash
npx prisma generate
```

6º Visualize suas tabelas no Prisma Studio:

```bash
npx prisma studio
```

7º Inicie o projeto:

```bash
npm run dev
```

8º Acesse uma plataforma que simule um cliente como o `POSTMAN`, `INSOMNIA` ou a extensão `THUNDER CLIENT`.

9º Acesse os endpoints para fazer as consultas:

- POST `/users`
  - Passar no body o seguinte conteúdo:

```bash
{
    "name": "exemplo",
    "email": "exemplo@exemplo.com",
    "username": "Exemplo123",
    "password": "exemplo123"
}
```
Retorno:

```bash
success: true,
code: 201
message: 'Usuário criado com sucesso !',
data: this.mapToDto(createUser)

OBS:. Não é retornado a senha !
```

- POST `/login`
  - Passar no body o seguinte conteúdo:

```bash
{
    "email": exemplo@exemplo.com,
    "password: senha123
}
```
Retorno:
```
success: true,
code: 200
message: 'Login efetuado com sucesso',
data: { token }
```

- POST `/tweets`
  - Passar no body o seguinte conteúdo
  - Passar no `Authorization` o `Token` criado no login.

```bash
Authorization: token

{
    "content": "Mensagem 1",
    "type": "Tweet",
    "userId": UUID do usuário
}
```
Retorno:
```bash
success: true,
code: 201,
message: 'Tweet criado com sucesso !',
data: this.mapToDto(createTweet),
```

- POST `/likes`
  - Passar no body o seguinte conteúdo
  - Passar no `Authorization` o `Token` criado no login.

```bash
Authorization: token

{
    "userId": UUID do usuário,
    "tweetId": UUID do Tweet de determinado usuário.
}
```
Retorno:
```bash
success: true,
code: 201,
message: 'Like criado com sucesso!',
data: this.mapToDto(createLike),
```

- POST `/replies`
  - Passar no body o seguinte conteúdo
  - Passar no `Authorization` o `Token` criado no login.

```bash
Authorization: token

{
    "content": "Resposta 1", 
    "type": "Reply", 
    "userId": UUID do usuário que vai responder, 
    "tweetId": UUID do Tweet de determinado usuário
}
```
Retorno:
```bash
success: true,
code: 201,
message: 'Reply criado com sucesso!',
data: this.mapToDto(createReply),
```

- POST `/followers`
  - Passar no body o seguinte conteúdo
  - Passar no `Authorization` o `Token` criado no login.

```bash
Authorization: token

{
    "userId": UUID do usuário que vai seguir,
    "followerId": UUID do usuário a ser seguido
}
```
Retorno:
```bash
success: true,
code: 201,
message: 'Reply criado com sucesso!',
data: this.mapToDto(createReply),
```

- POST `/logout`
  - Passar no `Authorization` o `Token` criado no login.

```bash
Authorization: token
```
Retorno:
```bash
success: true,
code: 200,
message: "Logout efetuado com sucesso"
```

Acesse os endpoints da API direto do deploy do `RENDER`:

https://avaliacao-final-banco-de-dados-2.onrender.com


<h2>Técnologias usadas no projeto</h2>

Linguagem de programação usada:

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)

Bibliotecas:

![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) 
![Bcrypt](https://img.shields.io/badge/Bcrypt-Hashing-informational?style=for-the-badge&logo=shield&logoColor=white&color=4CAF50)
![CORS](https://img.shields.io/badge/CORS-Enabled-brightgreen?style=for-the-badge&logo=shield&logoColor=white&color=AFC95D)

<h2>Contato</h2>
<div align="center">
  
  [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/johann-patr%C3%ADcio-daniel-112425196/)
  [![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)](https://wa.me/19991069456)

</div>
