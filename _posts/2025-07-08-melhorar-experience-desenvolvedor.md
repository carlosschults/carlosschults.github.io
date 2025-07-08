---
title: "Como Melhorar a Experiência do Desenvolvedor: 7 Coisas Para Mudar"
ref: improve-developer-experience
lang: pt
layout: post
author: Carlos Schults
description: "Aprenda o que é experiência do desenvolvedor e como melhorá-la na sua organização"
permalink: /pt/melhorar-experiencia-desenvolvedor
canonical: 
tags:
- devex
- opinion
---

{% capture content %}
Escrevi este post originalmente para a Nimbus. Você pode ler o [original no site deles, em inglês](https://www.usenimbus.com/post/how-to-improve-developer-experience-7-things-to-change).

{% endcapture %}
{% include callout.html type="info" title="NOTA"  content=content %}

## O Que é Experiência do Desenvolvedor? Por Que Você Deveria Se Importar?

No desenvolvimento de software, falamos muito sobre experiência do usuário, e com razão. Como é o usuário final que se beneficia diretamente do software que a gente escreve, faz sentido que ele esteja sempre no centro de todos os nossos esforços. Mas recentemente, outro termo começou a ganhar força no contexto de melhorar a qualidade do software: experiência do desenvolvedor, ou *developer experience* no original em inglês.

É sobre isso que este post trata — experiência do desenvolvedor. Vamos começar explicando o que é experiência do desenvolvedor e por que todas as organizações de software deveriam se importar com isso. A partir daí, vamos partir para a parte prática, apresentando uma lista de sugestões que você pode adotar imediatamente para melhorar a experiência do desenvolvedor na sua equipe ou empresa.

Aqui está minha definição de experiência do desenvolvedor: quão confortável e "desenrolado" é o processo de desenvolvimento de software para uma determinada equipe ou organização.

Por que a experiência do desenvolvedor é tão importante? Por que as pessoas começaram a falar tanto sobre isso recentemente?

Não é difícil de entender. Software é tremendamente valioso, então as pessoas que criam software também são tremendamente valiosas. É do interesse de qualquer empresa que cria software manter seus desenvolvedores felizes e produtivos, especialmente num mercado aquecido onde desenvolvedores recebem oportunidades o tempo todo.

Se você melhorar a experiência do desenvolvedor na sua empresa, é mais provável que você atraia ótimos desenvolvedores e mantenha os que já tem. A produtividade provavelmente vai aumentar, assim como a qualidade do trabalho.

## Experiência do Desenvolvedor: Melhore com Essas 7 Dicas

Chega de enrolação, vamos ver sete sugestões práticas que você pode adotar hoje para melhorar a experiência do desenvolvedor na sua empresa ou equipe.

### **1. Minimize as Interrupções**

De forma geral, desenvolvedores de software odeiam interrupções. Não é porque somos uns bichos do mato que não podem ser incomodados com reuniões ou atividades que podem ser descritas como "sociais" (ok, eu admito, alguns são).

O problema com interrupções é que o desenvolvimento de software é uma **atividade que requer longos períodos de foco intenso**. Como qualquer profissional cuja área exige esse nível de concentração vai dizer, alcançar esse estado demora tempo e esforço. No entanto, perdê-lo é fácil: basta o João da contabilidade ou seu gerente aparecer na sua mesa ou te mandar uma mensagem no Slack para fazer esse foco desaparecer no ar.

Para melhorar a experiência do desenvolvedor, minimize as interrupções. Em termos mais práticos, faça o seguinte:

*   **Use comunicação assíncrona o máximo possível.** Tente usar newsletter interno, artigos na wiki e atualizações por e-mail em vez de reuniões e chamadas.
*   **Adote um dia livre de reuniões.** Escolha um dia da semana, ou pelo menos meio dia, em que a agenda de todos fica bloqueada e não pode ser reservada. Isso vai dar a todos a chance de ter tempo dedicado para concentração profunda.
*   **Otimize o horário e duração das reuniões.** Reuniões são inevitáveis às vezes. Quando esse for o caso, escolha um horário e duração que facilite para as pessoas se concentrarem. Por exemplo, se o horário de trabalho da sua empresa termina às 18h, não agende uma reunião que termina às 17h30. Esses últimos trinta minutos provavelmente serão perdidos, já que não são suficientes para os desenvolvedores alcançarem o foco profundo que precisam.

### **2. Invista em Excelência Técnica**

A maioria dos desenvolvedores quer saber que seu trabalho importa. Eles querem saber que estão trabalhando numa equipe que cria software com os mais altos padrões, usando as melhores práticas disponíveis e encantando usuários com ótimas funcionalidades entregues rapidamente.

Portanto, investir em excelência técnica é uma ótima forma de melhorar a experiência dos desenvolvedores. A lista do que você pode fazer inclui o seguinte:

*   Adotar testes automatizados e, opcionalmente, [TDD (desenvolvimento guiado por testes)](/pt/testes-unitarios-csharp-intro-tdd/)
*   Usar integração contínua (CI) e entrega e deployment contínuos (CD).
*   Ter um processo de revisão de código ou, em vez, programação em par.
*   Usar analisadores estáticos e linters para detectar problemas comuns no código.
*   Coletar e acompanhar métricas de qualidade.

Essas são apenas algumas sugestões sobre o que você pode fazer para fomentar uma cultura de excelência técnica na qual os desenvolvedores sentem orgulho do seu trabalho e sentem que seu trabalho tem propósito.

### **3. Dê Autonomia aos Desenvolvedores**

Autonomia é um grande motivador de produtividade e felicidade no trabalho. Para se sentirem realizadas, as pessoas precisam ter pelo menos algum grau de autonomia sobre a forma como fazem seus trabalhos.

De forma geral, desenvolvedores deveriam receber um alto grau de autonomia sobre como fazem seu trabalho. Permita que as equipes decidam o seguinte:

*   Qual workflow de branching melhor atende suas necessidades
*   Se eles estimam usando pontos, tamanhos de camiseta, Fibonacci, horas ou algo completamente diferente
*   Quão rigorosamente eles querem aderir às cerimônias do seu sabor preferido de agile (por exemplo, se devem ou não ter um daily scrum)

No nível individual, permita que desenvolvedores escolham se querem trabalhar remotamente, no escritório ou de forma híbrida. Dê ao colaborador flexibilidade para montar um pacote de benefícios que faça sentido para ele (algumas pessoas têm filhos, outras não, então benefícios que atendem apenas pessoas casadas com filhos certamente vão alienar uma parte considerável da sua força de trabalho).

### **4. Remova o Atrito ao Criar Ambientes de Desenvolvimento**

Uma coisa que quase todo desenvolvedor odeia é um processo manual, tedioso e propenso a erros ao criar um novo ambiente de desenvolvimento. Esses processos fazem com que desenvolvedores demorem muito tempo até conseguirem contribuir com código para a equipe. Pior ainda, os processos frequentemente não são facilmente reproduzíveis, o que significa que diferenças entre ambientes podem ser introduzidas.

Como consequência, o ambiente de desenvolvimento se afasta do staging e produção, tornando bugs mais prováveis e criando a famosa desculpa "funciona na minha máquina".

Para melhorar a experiência do desenvolvedor, invista em formas de facilitar a criação de ambientes consistentes e reproduzíveis. Soluções de container como Docker são uma ótima forma de alcançar isso. Alternativamente, você pode aproveitar soluções que oferecem a criação de ambientes de desenvolvimento na nuvem.

### **5. Invista na Educação dos Desenvolvedores**

Debs também têm uma ótima experiência quando sentem que dominam as ferramentas do seu trabalho. A sensação de estar no controle é muito boa. Isso não só leva a um resultado de maior qualidade, mas também é mais prazeroso.

Então, uma forma certeira de melhorar a experiência do desenvolvedor é investir na educação deles. Há várias formas de fazer isso:

*   Oferecer aos desenvolvedores uma verba mensal ou anual que eles podem usar livremente para investir em cursos, livros ou certificações.
*   Dar aos desenvolvedores tempo (tempo remunerado da empresa, sim!) durante o qual eles podem estudar e praticar
*   Oferecer recursos de aprendizado pagos pela empresa, como uma biblioteca da empresa ou serviços como Udemy ou Pluralsight

### **6. Não Seja Pão-Duro com Ferramentas**

Se você quer que seus desenvolvedores façam um ótimo trabalho, você deve dar a eles as ferramentas para fazê-lo. **Se seus desenvolvedores não conseguem entregar um ótimo trabalho devido a um computador lento ou falta de licença de software, a culpa é sua**.

Seus programadores deveriam ter ótimo hardware, como laptop fornecido pela empresa, monitor, teclado e por aí vai (e até complementos de escritório como uma ótima cadeira).

Você também deveria fornecer o software necessário. Isso inclui licenças de IDE, assinaturas de serviços, plugins e o que mais for preciso. Não importa o que seus desenvolvedores precisam para realizar seu trabalho, a empresa deveria, dentro do razoável, fornecer.

### **7. Ouça o Feedback dos Desenvolvedores (e Aja Baseado Nele)**

Por último, mas não menos importante, aqui está o item final da nossa lista: ouça seus desenvolvedores!

Entende o seguinte: desenvolvedores de software geralmente são pessoas inteligentes que se importam com o que fazem. As chances são de que eles tenham ideias muito boas sobre como melhorar não apenas sua própria experiência, mas a de suas equipes e organizações como um todo.

Ouça seus desenvolvedores. Quando fizer sentido, coloque suas sugestões em prática. Além do benefício criado pela sugestão em si, isso terá o benefício adicional de melhorar o moral da equipe. Seus desenvolvedores vão se sentir valorizados e como parte essencial da equipe. O que, é claro, eles são.

### **Melhore a Experiência do Desenvolvedor, Melhore Sua Empresa**

Se sua organização é uma organização de tecnologia, então desenvolvedores de software são indiscutivelmente seus ativos mais preciosos. Então, melhorar a experiência do desenvolvedor, além de ser uma coisa decente e humana a se fazer, também é um ótimo investimento. É do seu interesse manter seus desenvolvedores felizes e produtivos, e como você viu neste post, isso é algo que você pode alcançar relativamente facilmente.

As sugestões neste post são simplesmente sugestões. Seus resultados podem variar (por exemplo, se você trabalha numa indústria altamente regulamentada, dar aos desenvolvedores um alto grau de autonomia pode não se aplicar). Como sempre, use seu julgamento. Considere a lista neste post como um ponto de partida. Ajuste conforme necessário, corte e adicione a ela. O que importa é que você melhore a experiência do desenvolvedor na sua empresa pelo bem dos seus desenvolvedores, seus usuários finais e a empresa como um todo.

Obrigado pela leitura!