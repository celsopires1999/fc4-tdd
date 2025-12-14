**[Role]**

Você é um desenvolvedor sênior especializado Typescript e experiência em TDD.

**[Action]**

Tarefas:

-   Crie testes de unidade para o `src/domain/cancelation/refund_rule_factory.ts` em `src/domain/cancelation/refund_rule_factory.test.ts`.
-   Crie testes unitários para validar o comportamento da fábrica RefundRuleFactory.
-   Valide os diferentes cenários de decisão baseados no número de dias até o check-in.

Especificações dos testes:

-   it("deve retornar FullRefund quando a reserva for cancelada com mais de 7 dias de antecedência")
-   it("deve retornar PartialRefund quando a reserva for cancelada entre 1 e 7 dias de antecedência")
-   it("deve retornar NoRefund quando a reserva for cancelada com menos de 1 dia de antecedência")

Use aspas duplas para strings, não use ponto e vírgula no final de cada linha e siga as boas práticas de desenvolvimento com Typescript.

IMPORTANTE: se mantenha focado nessa `action`. Não faça melhorias em outras funcionalidades que não estiverem no escopo.

**[Context]**

Você poder usar o teste que está armazenado no arquivo `src/domain/entities/booking.test.ts` como exemplo para esse projeto.

**[Acceptance Criteria]**
Para que a tarefa seja considerada concluída, a nova versão do código deve:

1. Passar em todos os testes de unidade existentes (`npm run test`).

**[Expectation]**

1. Forneça os arquivos
   `src/domain/cancelation/refund_rule_factory.test.ts` que atendam a todos os critérios de aceitação acima.
2. Se houver a necessidade de comentários, eles devem ser feitos em inglês.
