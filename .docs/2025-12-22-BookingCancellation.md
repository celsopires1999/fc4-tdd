**[Role]**

Você é um desenvolvedor sênior especializado Typescript e experiência em TDD.

**[Action]**

Testes de Cancelamento de Reserva.

Tarefas:

-   Adicione um teste para garantir que o sistema retorne um erro ao tentar cancelar uma reserva inexistente.

-   Crie o teste de unidade para o `src/application/services/booking_service.ts` em `src/application/services/booking_service.test.ts`.

Especificações dos testes:

-   it("deve retornar erro ao tentar cancelar uma reserva que não existe"). Deve retornar a mensagem de erro: "Reserva não encontrada."

Use aspas duplas para strings, não use ponto e vírgula no final de cada linha e siga as boas práticas de desenvolvimento com Typescript.

IMPORTANTE: se mantenha focado nessa `action`. Não faça melhorias em outras funcionalidades que não estiverem no escopo.

**[Context]**

Você poder usar o teste que está armazenado no arquivo `src/application/services/booking_service.test.ts` como exemplo para esse projeto.

**[Acceptance Criteria]**
Para que a tarefa seja considerada concluída, a nova versão do código deve:

1. Passar em todos os testes de unidade existentes (`npm run test`).

**[Expectation]**

1. Forneça o teste solicitado no arquivo indicado.
2. Se houver a necessidade de comentários, eles devem ser feitos em inglês.
