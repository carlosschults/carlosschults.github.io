---
title: "[Tradução] Tudo o que você precisa saber sobre configuração e gerenciamento de segredos em .NET"
ref: configuracao-dotnet
lang: pt
layout: post
author: Sander ten Brinke, Carlos Schults (tradução)
description: Um guia abrangente sobre configuração em .NET de autoria de Sander ten Brinke
permalink: /pt/configuracao-dotnet
img: https://res.cloudinary.com/dz5ppacuo/image/upload/v1513817072/csharp8-1037x438_skogpz.jpg
tags:
- csharp
- dotnet
- configuracao
- traducoes
- tutorial
---

![]({{ page.img }})

{% capture content %}

Este post é uma tradução, cuja publicação foi autorizada pelo autor. Caso tenha interesse, [leia o artigo original, em inglês.](https://stenbrinke.nl/blog/configuration-and-secret-management-in-dotnet/).

Eu decidi não traduzir as imagens, pois achei que seria muito trabalhoso. Portanto, as figuras que você verá são as mesmas do artigo original, com as informações nelas em inglês.

Em respeito ao autor, procurei deixar o artigo o mais próximo possível do original: mantive _call to actions_ que o autor faz para suas palestras e conteúdos, e também mantive um pedido de contribução financeira ao final do artigo.

A partir do índice, inicia-se o artigo de autoria de Sander ten Brinke. Após a conclusão do artigo, eu volto com algumas palavras antes de finalizar. Boa leitura!

{% endcapture %}
{% include callout.html type="info" title="NOTA"  content=content %}


Índice
-----------------

* [Introdução](#introdução)
* [Configuração no .NET](#configuração-no-net)
    * [O básico](#o-básico)
    * [Acesso a dados estruturados](#acesso-a-dados-estruturados)
    * [Como tudo isso funciona](#como-tudo-isso-funciona)
    * [Tratando a configuração como código](#tratando-a-configuração-como-código)
* [options pattern](#options-pattern)
    * [Injeção de dependência](#injeção-de-dependência)
    * [Validação](#validação)
    * [Tempos de vida da configuração](#tempos-de-vida-da-configuração)
* [Gerenciamento de segredos durante o desenvolvimento](#gerenciamento-de-segredos-durante-o-desenvolvimento)
    * [O provedor de configuração de user secrets](#o-provedor-de-configuração-de-user-secrets)
    * [Usando user secrets](#usando-user-secrets)
    * [Configurando um projeto que usa user-secrets](#configurando-um-projeto-que-usa-user-secrets)
* [Meu modelo para gerenciamento de configuração](#meu-modelo-para-gerenciamento-de-configuração)
    * [appsettings.json](#appsettingsjson)
    * [appsettings.Development.json](#appsettingsdevelopmentjson)
    * [User Secrets](#user-secrets)
* [Usando o Azure para armazenar a configuração](#usando-o-azure-para-armazenar-a-configuração)
    * [Armazenamento de segredos no Azure Key Vault](#armazenamento-de-segredos-no-azure-key-vault)
    * [Conectando-se ao Azure com identidades gerenciadas](#conectando-se-ao-azure-com-identidades-gerenciadas)
    * [Armazenamento da configuração na Configuração de Aplicativo do Azure](#armazenamento-da-configuração-na-configuração-de-aplicativo-do-azure)
* [Finalizando](#finalizando)
    * [Links para a demo](#links-para-a-demo)
    * [Links para a documentação oficial](#links-para-a-documentação-oficial)
* [Carlos de volta](#carlos-de-volta)

{% capture content %}
Este post é um complemento da minha palestra [Keep it secret, keep it safe with .NET](https://sessionize.com/s/sander-ten-brinke/keep-it-secret-keep-it-safe-with-.net/48314)! Se você não puder assistir a uma sessão dessa palestra, poderá ler esta post em vez disso! Dessa forma, o maior número possível de pessoas poderá aprender sobre o sistema de configuração do .NET e como manter os segredos em segurança!

Minha palestra oferece algumas informações mais detalhadas, portanto, se quiser saber mais, dê uma olhada na minha página [Speaking](https://stenbrinke.nl/speaking) para ver quando e onde darei essa palestra novamente! Você também pode [entrar em contato](https://stenbrinke.nl/about/#contact-details) se quiser que eu dê essa palestra em seu evento!
{% endcapture %}
{% include callout.html type="info" title="Info"  content=content %}

## Introdução

Se você já escreve código há algum tempo, provavelmente já usou configuração de alguma forma. Pense em feature flags, configurações de log, configurações de autenticação etc. Talvez você tenha usado um arquivo de configuração com algumas configurações para o seu aplicativo ou talvez tenha usado variáveis de ambiente. Talvez você tenha usado ambos!

Também é provável que você tenha interagido com segredos, que também considero parte de um sistema de configuração. Pense em strings de conexão e chaves de API. Elas devem ser sempre seguras!

A configuração no .NET mudou radicalmente desde a introdução do .NET Core. Já se foi o tempo em que se usavam vários arquivos `Web.config` e agora temos um sistema muito mais flexível. No entanto, um sistema flexível também pode ser um sistema complexo. É por isso que eu quis criar uma palestra e uma publicação no blog em que você aprenderá como funciona o sistema de configuração do .NET e como usá-lo de forma otimizada. Você também aprenderá a manter seus segredos seguros, tanto localmente quanto em produção, usando o poder da nuvem do Azure!

{% capture content %}
Este post contém **tudo** que você precisa saber sobre configuração e gerenciamento de segredos no .NET. Ela não aborda todos os detalhes, mas abrange tudo o que acredito que um desenvolvedor .NET tem que saber. Considere-o um guia de bolso útil que você pode usar ou enviar a outras pessoas quando elas tiverem dúvidas sobre configuração e gerenciamento de segredos no .NET.

Acho que esta post é muito útil porque são necessárias **múltiplas horas** para _encontrar_ e ler completamente a documentação da Microsoft sobre esses tópicos. Se quiser saber mais, você encontrará links para a documentação oficial no final do post.
{% endcapture %}
{% include callout.html type="info" title="Info"  content=content %}

Vamos começar!

## Configuração no .NET

O sistema de configuração do .NET é muito flexível! Você pode usar vários provedores de configuração, sendo que cada um deles pode ter um formato de configuração diferente:

![Uma imagem que mostra uma visão geral do sistema de configuração do .NET com a interface IConfiguration e vários provedores](/img/configuracao-dotnet/configuration-overview.webp)

Uma visão geral do sistema de configuração do .NET.  
[Extraído da documentação oficial](https://learn.microsoft.com/dotnet/core/extensions/configuration?WT.mc_id=DT-MVP-5005050#concepts-and-abstractions)

Outras fontes podem ser arquivos como `.xml`, `.ini` e muito mais. Você pode até mesmo conectar seu sistema de configuração à nuvem, o que faremos mais adiante!

### O Básico

Como você pode ver, toda a sua configuração pode ser acessada usando a interface `IConfiguration`. Com isso, você pode recuperar seus valores de uma maneira fortemente tipada. Um exemplo:

{% highlight c# %}
public IConfiguration Configuration { get; set; }

public string GetApiKey()
{
    // GetValue<> permite que você passe o tipo de retorno
    string method1 = Configuration.GetValue<string>(“ApiKey”); 

    // A variante do indexador sempre retorna uma string
    string method2 = Configuration[“ApiKey”]; 

    return method1;
}

{% endhighlight %}


Você perceberá que não estamos especificando qual provedor deve ser usado para recuperar a `ApiKey`. Isso ocorre porque isso não deveria importar; a `IConfiguration` esconde toda essa complexidade de nós e, portanto, cria flexibilidade. O sistema de configuração decide qual provedor usar com base na ordem dos provedores. Falaremos mais sobre isso mais tarde!

### Acesso a dados estruturados

Um recurso muito avançado do sistema de configuração do .NET é o fato de ele oferecer suporte a dados estruturados. Isso é muito útil porque permite que você agrupe valores de configuração relacionados. Todos os provedores oferecem suporte a dados estruturados, mas se você já trabalhou com um projeto ASP.NET Core, provavelmente reconhecerá o mais comum, que é `appsettings.json`. O JSON a seguir é um exemplo de um arquivo desse tipo:

```
{
  “Logging": {
    “LogLevel": {
      “Default” (Padrão): “Informações”,
      “Microsoft.AspNetCore": “Warning”
    }
  },
  “AllowedHosts": “*”,

  “ConnectionStrings": {
    “Banco de dados": “CONNECTIONSTRING_HERE”
  },

  “Features” (Recursos): {
    “EnableNewUI": false
  }
}
```

Você pode imaginar o objeto raiz e as seções `Logging`, `ConnectionStrings` e `Features` como “dados estruturados”.

Para interagir com essas seções no .NET, você pode usar o código a seguir.

{% capture content %}
O código a seguir não é a melhor maneira de interagir com dados estruturados! Falaremos sobre maneiras melhores (usando o padrão Options) [mais adiante](#options-pattern).
{% endcapture %}
{% include callout.html type="warning" title="Aviso" content=content %}

{% highlight c# %}
public IConfiguration Configuration { get; set; }

// ...

public IConfigurationSection GetFeaturesSection()
{
    // GetSection retorna nulo quando a seção não pode ser encontrada
    var method1 = Configuration.GetSection(“Features”);

    // GetRequiredSection dispara uma exceção quando a seção não pode ser encontrada.
    // SEMPRE prefira esse método ao GetSection para evitar bugs desagradáveis!
    var method2 = Configuration.GetRequiredSection(“Features”);

    return method2;
}

public bool GetEnableNewUI()
{
    return Configuration.GetValue<bool>(“Features:EnableNewUI”);
}
{% endhighlight %}


A `IConfigurationSection` fornece a mesma API que a `IConfiguration`, portanto, você pode chamar `featuresSection.GetValue<bool>(“EnableNewUI”)` para obter o valor dessa seção. Também é possível acessar diretamente um valor de configuração que existe dentro de uma seção usando um `:`, que pode ser visto em uso no método `GetEnableNewUI`.

{% capture content %}
Os dados estruturados não se limitam aos arquivos JSON. Todos os provedores são compatíveis com eles, embora a sintaxe para especificar uma seção possa ser diferente. Por exemplo, para fornecer um valor para `EnableNewUI` usando uma variável de ambiente, você terá que criar uma chamada `Features__EnableNewUI`.
{% endcapture %}
{% include callout.html type="info" title="Info"  content=content %}

### Como tudo isso funciona?

Estamos usando `IConfiguration` em alguns exemplos. Você deve estar se perguntando como tudo isso funciona nos bastidores; como criar uma instância de `IConfiguration` e como configurá-la? Vamos dar uma olhada!

Para criar uma instância de `IConfiguration`, você precisará usar a classe `ConfigurationBuilder` (ou outra classe que implemente `IConfigurationBuilder`). Essa classe usa o padrão Builder para que você possa adicionar vários provedores. No final, você chama `Build()` e acaba com um `IConfigurationRoot`. É a mesma coisa que `IConfiguration`, mas também tem uma lista de todos os provedores que você adicionou. Você nunca deve usar o `IConfigurationRoot` diretamente, pois não deve acessar os provedores por baixo do pano. Um exemplo:

{% highlight c# %}
var builder = new ConfigurationBuilder();

builder.AddJsonFile(“sharedsettings.json”);
builder.AddJsonFile(“appsettings.json”);
builder.AddEnvironmentVariables();
// E assim por diante...

IConfigurationRoot configuration = builder.Build();

{% endhighlight %}


A ordem desses provedores é muito importante porque se trata de um sistema em camadas. Dê uma olhada na imagem a seguir:

![Uma imagem que mostra a importância da ordem dos provedores de configuração](/img/configuracao-dotnet/configuration-providers-layers.webp)

Uma visão geral da importância da ordem dos provedores de configuração.  
[ASP.NET Core in Action, Second Edition (Permissão concedida pelo autor Andrew Lock)](https://www.manning.com/books/asp-net-core-in-action-second-edition)

Imagine que `sharedsettings.json` tenha um valor para todos os valores de configuração usados pelo aplicativo. O `appsettings.json` e as `Variáveis de ambiente` contêm um subconjunto desses valores. Como o provedor para as variáveis de ambiente foi adicionado por último, ele tem a prioridade mais alta. Portanto, se você quiser recuperar um valor de configuração chamado `ApiKey`, o sistema examinará primeiro as variáveis de ambiente. Se ele existir, será retornado, mesmo que outros provedores também contenham um valor para `ApiKey`. No entanto, se as variáveis de ambiente não contiverem um valor para `ApiKey`, ele passará para o provedor que foi adicionado antes dele e pesquisará lá, e assim por diante.

#### Os valores default

Talvez você esteja um pouco confuso neste ponto. Eu certamente estava quando aprendi sobre o `IConfigurationBuilder` e a importância dessas camadas. Por quê? Bem, percebi que estava usando o `IConfiguration` em muitos projetos, mas nunca tinha ouvido falar do `IConfigurationBuilder` antes. Então, como eu poderia estar usando o `IConfiguration`?

Isso funciona porque, se você trabalhar em um aplicativo .NET que [usa um Host](https://learn.microsoft.com/dotnet/core/extensions/generic-host?WT.mc_id=DT-MVP-5005050), ele definirá todo um sistema de configuração para você por padrão! Por exemplo, [projetos ASP.NET Core](https://learn.microsoft.com/aspnet/core/fundamentals/host/generic-host?WT.mc_id=DT-MVP-5005050) e [workers services](https://learn.microsoft.com/dotnet/core/extensions/workers?WT.mc_id=DT-MVP-5005050#worker-service-template) usam um `Host`, portanto, na maioria dos projetos, isso será feito para você! Agora vamos dar uma olhada em como isso funciona.

Em um aplicativo ASP.NET Core padrão, o seguinte é configurado para você.

| Provedor                                   | Exemplo                                                          | Notas                                                                                               |
|--------------------------------------------|------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| appsettings.json                           | { “Key”: “default value” }                                       |                                                                                                     |
| appsettings.{ENVIRONMENT}.json             | { “Key”: “development value” }                                   |                                                                                                     |
| user secrets (desenvolvimento)      | dotnet user-secrets set “key” “development value”                | Também pode ser definido em IDEs. Mais sobre isso posteriormente.                                   |
| Variáveis de ambiente                      | Powershell: setx key “valor do ambiente” <br> Bash: export key=‘valor do ambiente’ | Também pode ser definido em IDEs. Muito popular em implantações do Docker/Kubernetes.               |
| Argumentos da linha de comando             | dotnet run –key “important value”                               | Também pode ser definido nos IDEs.                                                                  |


O item no topo tem a prioridade mais baixa. Portanto, se você chamar `Configuration[“key”]`, obterá como resultado `important value`, mesmo que o User Secrets também forneça um valor.

{% capture content %}
O provedor User secrets só é adicionado quando o _Environment_ é definido como _Development_. Os ambientes serão tratados a seguir. Os user secrets são tratados em profundidade [mais adiante](#user-secrets).
{% endcapture %}
{% include callout.html type="info" title="Info" content=content %}

O Visual Studio (e outros IDEs, como o JetBrains Rider) oferecem suporte à configuração de variáveis de ambiente/argumentos de linha de comando em seu IDE quando você acessa as propriedades do projeto. No entanto, aconselho **contra** o uso disso durante o desenvolvimento. Eu nunca uso variáveis de ambiente ou argumentos de linha de comando durante o desenvolvimento porque é mais difícil editá-los do que simplesmente abrir um arquivo. Armazená-los em `appsettings.Development.json` (que será abordado a seguir) é mais conveniente para você e seus colegas.

#### Configuração e Ambientes

O provedor _appsettings.{**ENVIRONMENT**}.json_ é um pouco diferente dos outros provedores. Isso ocorre porque ele depende do [ambiente do aplicativo](https://learn.microsoft.com/aspnet/core/fundamentals/environments?WT.mc_id=DT-MVP-5005050). O ambiente atual do aplicativo é lido a partir do valor da variável de ambiente `DOTNET_ENVIRONMENT` ou `ASPNETCORE_ENVIRONMENT`. Se o seu projeto não for um projeto ASP.NET Core, o aplicativo verificará apenas `DOTNET_ENVIRONMENT`. Os projetos ASP.NET Core retornam para `DOTNET_ENVIRONMENT` quando `ASPNETCORE_ENVIRONMENT` não existe.

O ambiente será considerado como `Production` quando essas variáveis de ambiente não existirem.

Quando você cria um projeto ASP.NET Core, um arquivo chamado `launchSettings.json` será criado na pasta `Properties`. Aqui, você pode ver que a variável de ambiente `ASPNETCORE_ENVIRONMENT` está definida como `Development`:

```
{
  // Muitos outros detalhes foram removidos desse arquivo para fins de brevidade
  “$schema": “https://json.schemastore.org/launchsettings.json”,
  “profiles": {
    “MY_PROJECT": {
      “commandName": “MY_PROJECT”,
      “applicationUrl": “https://localhost:7237;http://localhost:5292”,
      “environmentVariables": {
        “ASPNETCORE_ENVIRONMENT": “Development”
      }
    }
  }
}

```

O resultado do sistema de configuração trabalhando em conjunto com o ambiente do aplicativo resulta em um recurso muito poderoso, pois permite que você crie arquivos de configuração diferentes para cada ambiente.

Você pode armazenar valores padrão em `appsettings.json` e substituí-los em `appsettings.Development.json`, `appsettings.Test.json`, `appsettings.Staging.json` e `appsettings.Production.json`.

Por exemplo, digamos que você tenha terminado o novo design de uma página de checkout de uma loja virtual. Ele ainda precisa ser testado e revisado por outras pessoas em um ambiente de teste, mas ainda não deve entrar em produção. Esse parece ser um caso de uso perfeito para feature flags! Você poderia criar um feature flag chamado `EnableNewCheckoutUI` e defini-lo como `false` em `appsettings.json` como o valor padrão. Em seguida, você pode substituir esses valores em `appsettings.Development.json` e `appsettings.Test.json` para que eles sejam ativados somente lá:

```
// appsettings.json
{
  “FeatureFlags": {
    “EnableNewCheckoutUI": false
  }
}

// appsettings.Development.json e appsettings.Test.json
{
  “FeatureFlags": {
    “EnableNewCheckoutUI": true
  }
}

```

Você não está limitado aos nomes de ambiente mencionados acima; eles são apenas os padrões que o .NET usa. Se quiser usar um nome diferente, configure a variável de ambiente `ASPNETCORE_ENVIRONMENT` com o nome de sua escolha e crie um arquivo `appsettings.ENV_NAME.json` correspondente. A única outra coisa que você precisa fazer é garantir que o ambiente em que você executa seu aplicativo tenha `ASPNETCORE_ENVIRONMENT` ou `DOTNET_ENVIRONMENT` definido com o valor correto.

### Tratando a Configuração Como Código

Anteriormente, elogiei o sistema de configuração do .NET e o `IConfiguration` por serem flexíveis e ricos em recursos. Falei sobre seu suporte a dados estruturados e sobre a recuperação de valores de uma hierarquia de configuração mais profunda. Mas você sabia que pode fazer muito mais com dados estruturados?

Digamos que nosso aplicativo se comunique com uma API externa usando HTTP. Para isso, precisamos de um `ApiUrl`, `ApiKey` e talvez queiramos configurar um `TimeoutInMilliseconds`. Do ponto de vista do código, talvez queiramos armazenar esses valores em uma classe (ou `record`) porque eles pertencem um ao outro:

{% highlight c# %}
public class ExternalApiSettings
{
    public string ApiUrl { get; set; }
    public string ApiKey { get; set; }
    public int TimeoutInMilliseconds { get; set; }
}

{% endhighlight %}


Em seguida, teríamos uma classe `ExternalApiClient` que usa a configuração e a classe que acabamos de criar:

{% highlight c# %}
public class ExternalApiClient
{
    private readonly IConfiguration _configuration;

    public Foo(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void CallExternalApi()
    {
        IConfigurationSection externalApiSettingsSection = _configuration.GetRequiredSection(“ExternalApiSettings”);
        
        // Método 1 (Get<TType>() obtém os valores dessa seção e os mapeia em uma nova instância da classe fornecida)
        ExternalApiSettings settings1 = externalApiSettingsSection.Get<ExternalApiSettings>(); 

        // Método 2 (Bind() espera uma instância existente de um tipo e mapeará os valores para essa instância existente)
        ExternalApiSettings settings2 = new();
        _configuration.GetRequiredSection(“ExternalApiSettings”).Bind(settings2);

        // Faça algo com essas configurações aqui...
    }
}

{% endhighlight %}


Isso parece bem legal, certo? Em vez de realizar 3 chamadas para obter cada propriedade de configuração relacionada à API individualmente, podemos mapeá-las em um objeto fortemente tipado. Agora podemos tratar nossa configuração como código! Poderíamos até criar métodos em nossa classe `ExternalApiSettings` para torná-la ainda mais poderosa!

No entanto, há algumas desvantagens importantes nessa abordagem.

#### Desvantagens

* A primeira desvantagem é que o nosso `ExternalApiClient` requer uma instância de `IConfiguration` para funcionar. Essa é uma dependência muito grande e um grande desperdício, considerando que ele usa apenas 3 valores de configuração! Além disso, essa classe agora pode acessar outros valores de configuração, como uma string de conexão a um banco de dados, configurações de registro, feature flags etc., mesmo que não precise dessas informações.
* A segunda desvantagem é que essa classe está violando o princípio da responsabilidade única. Ela não é responsável apenas por chamar a API externa, mas também por interagir com o sistema de configuração para poder chamar essa API externa.
* Como essa classe interage diretamente com o sistema de configuração, ela depende de sua estrutura e, portanto, está fortemente acoplada. Qualquer alteração na seção de configuração `ExternalApiSettings` (como o nome ou os nomes de seus filhos) causaria problemas em tempo de execução.

Então, o que podemos fazer em relação a isso? Reescrevê-la em Rust 🦀? Não, podemos usar o options pattern!

## Options Pattern

O _options pattern_ ("padrão de opções") permite que você faça um uso ainda melhor do sistema de configuração do .NET 🚀! Ele permite a você desacoplar seu aplicativo do sistema de configuração e adiciona muitos recursos poderosos a esse sistema, como:

* Injeção de dependência
* Validação
* Diferentes tempos de vida de configuração
* E muito mais!

Para começar a usar o options pattern de forma eficaz, é necessário criar classes/records das suas seções de configuração. Já fizemos isso no exemplo anterior, portanto, vamos continuar com ele:

{% highlight c# %}
public class ExternalApiSettings
{
    public string ApiUrl { get; set; }
    public string ApiKey { get; set; }
    public int TimeoutInMilliseconds { get; set; }
}

{% endhighlight %}


### Injeção de dependência

O options pattern funciona muito bem com a injeção de dependência! Para isso, basta registrar sua classe/record de opções na coleção de serviços. Dependendo do seu projeto, o ponto de entrada para isso pode ser o método `Startup.cs -> ConfigureServices(IServiceCollection services)` ou em algum lugar em seu `Program.cs`.

{% highlight c# %}
services.Configure<ExternalApiSettings>(configuration); // Passe em uma instância existente de IConfiguration

{% endhighlight %}


Isso adicionará uma instância de `IOptions<ExternalApiSettings>` ao seu contêiner de injeção de dependência. Para ver os benefícios dessa abordagem, vamos dar uma olhada em como poderíamos melhorar nosso `ExternalApiClient` de antes:

{% highlight c# %}
public class ExternalApiClient
{
    private readonly ExternalApiSettings _externalApiSettings;

    public ExternalApiClient(IOptions<ExternalApiSettings> options)
    {
        // Importante: o padrão Options é “preguiçoso”. Isso significa que as opções são mapeadas somente quando você as solicita chamando .Value!
        // Isso é feito apenas uma vez, portanto, você não precisa se preocupar com o desempenho.
        _externalApiSettings = options.Value;
    }

    public void CallExternalApi()
    {
        // Faz algo com essas configurações aqui...
    }
}

{% endhighlight %}

Isso eliminou todas as desvantagens de antes! Nosso `ExternalApiClient` não tem mais uma dependência do `IConfiguration` e não está mais acoplado ao sistema de configuração. Ele também não precisa mais se preocupar com a estrutura do sistema de configuração.

Você pode argumentar que temos uma dependência indireta do sistema de configuração por causa da chamada `.Configure<>(configuration)` de antes, mas você não é obrigado a usar esse método para configurar suas opções. Você pode criar uma instância de `IOptions<T>` usando `Microsoft.Extensions.Options.Options.Create()` se precisar criar uma instância manualmente, e pode passar quaisquer dados que desejar. Você pode até mesmo criar opções com base em outras dependências usando o método `Configure<TDep1,...>()` do `OptionsBuilder`, que será discutido a seguir.

{% capture content %}
Talvez você se pergunte por que precisamos envolver nossa classe de configurações com uma interface `IOptions<>`. Isso ocorre porque ela permite que você use alguns recursos mais avançados sobre os quais falaremos a seguir.
{% endcapture %}
{% include callout.html type="info" title="Info" content=content %}

### Validação

Meu recurso favorito do sistema de configuração do .NET é a facilidade com que é possível validar sua configuração! Acredito que essa seja uma das partes mais importantes de qualquer aplicativo, e não vejo que ela seja usada com frequência. O motivo pelo qual acredito que a configuração é uma das partes mais importantes de qualquer aplicativo é porque ela abriga definições muito importantes do seu aplicativo.

Um aplicativo configurado incorretamente pode ter resultados desastrosos. Na pior das hipóteses, imagine que o seu ambiente de teste esteja se conectando acidentalmente aos recursos do ambiente de produção. Agora imagine que você testaria uma função de exclusão em massa e acidentalmente excluiria todos os seus dados de produção. Isso seria um desastre!

É por isso que queremos validar nossa configuração. Se o nosso aplicativo for iniciado com um sistema de configuração incorreto, queremos sair imediatamente.

Então, como configuramos isso? É mais fácil do que você imagina. Eu gosto de usar [Data Annotations](https://www.infoworld.com/article/3543302/how-to-use-data-annotations-in-c-sharp.html) para minhas validações de opções quando não preciso de regras de validação complexas, portanto, vamos modificar nosso `ExternalApiSettings` desta forma:

{% highlight c# %}
public class ExternalApiSettings
{
    [Required] // Se o ApiUrl não estiver definido, a configuração é inválida
    public string ApiUrl { get; set; }

    [Required] // Se a ApiKey não for definida, a configuração será inválida
    public string ApiKey { get; set; }

    [Range(1, 1_000_00)] // Se o TimeoutInMilliseconds não for definido (o padrão é 0) ou for maior que 100000, a configuração será inválida
    public int TimeoutInMilliseconds { get; set; }
}

{% endhighlight %}


Agora, vamos alterar a forma como registramos essas opções no contêiner de injeção de dependência:

{% highlight c# %}
services
    .AddOptions<ExternalApiSettings>()
    .BindConfiguration(“ExternalApiSettings”)
    .ValidateDataAnnotations() // Lança uma OptionsValidationException se a configuração for inválida
    .ValidateOnStart(); // Altamente recomendado!

{% endhighlight %}


Em vez de usar `Configure<TType>(configuration)`, agora usamos `AddOptions<TType>()`. Isso retorna um `OptionsBuilder` e nos permite usar alguns métodos poderosos.

1.  O primeiro que usamos é o `BindConfiguration()`. Esse método recupera o `IConfiguration` do contêiner de injeção de dependência e vincula a seção que passamos. Isso é útil porque não precisamos mais passar manualmente nossa configuração.
2.  Em seguida, chamamos `ValidateDataAnnotations()`. Isso validará nossa seção de configuração com base nos atributos que definimos nas propriedades.
    1.  Observação: você precisa instalar o pacote nuget [Microsoft.Extensions.Options.DataAnnotations](https://www.nuget.org/packages/Microsoft.Extensions.Options.DataAnnotations) se não tiver esse método disponível.
3.  Por fim, chamamos `ValidateOnStart()`. Essa etapa é **muito** importante! Por padrão, suas opções só serão validadas quando você chamar `.Value` nelas em algum lugar, como em uma classe onde elas são injetadas. Isso significa que seu aplicativo NÃO lançaria um erro e sairia na inicialização quando sua configuração fosse inválida! O `ValidateOnStart()` validará sua configuração depois que o aplicativo terminar de se inicializar.

Você também pode validar seu código de muitas outras maneiras. Você pode usar a interface `IValidatableOptions<>` para implementar uma lógica de validação complexa ou pode chamar `Validate(Func<TOptions, bool> validation)` para escrever uma lógica de validação personalizada como parte do construtor de opções. Você pode até mesmo [integrá-lo ao FluentValidation](https://andrewlock.net/adding-validation-to-strongly-typed-configuration-objects-using-flentvalidation/)!

### Tempos de vida da configuração

Por fim, gostaria de falar sobre o tempo de vida do padrão Options. O `IOptions<T>` é um singleton. Isso significa que, se um de seus [provedores de configuração for atualizado em tempo de execução](https://learn.microsoft.com/dotnet/core/extensions/configuration-providers?WT.mc_id=DT-MVP-5005050#json-configuration-provider), as opções não serão atualizadas. Isso ocorre porque as opções são mapeadas apenas uma vez quando você chama `.Value` sobre elas.

Isso pode ser considerado positivo, pois significa que seu aplicativo não mudará repentinamente de comportamento quando a configuração for alterada. No entanto, você também pode dizer que isso é ruim porque talvez não queira ter que fazer deploy ou reiniciar o aplicativo quando alterar a configuração. Nesse caso, é melhor usar `IOptionsSnapshot<T>` ou `IOptionsMonitor<T>`.

![Visão geral dos recursos de IOptions, IOptionsSnapshot e IOptionsMonitor](/img/configuracao-dotnet/options-lifetimes.webp)

Visão geral dos recursos de IOptions, IOptionsSnapshot e IOptionsMonitor

#### IOptionsSnapshot

Em vez de injetar `IOptions<T>` em uma de suas classes, você pode injetar `IOptionsSnapshot<T>`. Isso recarregará esse tipo específico de opções a cada [scope](https://learn.microsoft.com/dotnet/core/extensions/dependency-injection?WT.mc_id=DT-MVP-5005050#scoped). Um escopo no .NET é um termo abstrato. Um escopo pode ser uma solicitação HTTP, por exemplo. Portanto, para cada solicitação HTTP, ele recarregaria as opções e elas permaneceriam consistentes para toda a solicitação. Isso significa que, se você alterar sua configuração, ela só será atualizada em uma nova solicitação.

{% capture content %}
Usar `IOptionsSnapshot<T>` pode causar [desempenho ruim.](https://github.com/dotnet/runtime/issues/53793)
{% endcapture %}
{% include callout.html type="warning" title="Aviso" content=content %}

#### IOptionsMonitor

O `IOptionsMonitor<T>` não funciona com escopos. Em vez disso, você precisa chamar `.CurrentValue` (em vez de `.Value`) para recuperar a versão atual. No entanto, é preciso ter cuidado com a forma como você acessa a sua configuração! Imagine um cenário em que sua configuração é alterada no meio de uma solicitação HTTP. Chamar `.CurrentValue` no início e no final de uma solicitação resultaria em valores diferentes, o que cria um risco de sincronização. Você pode registrar uma chamada de retorno usando `OnChange()` para ser notificado sobre esses eventos.

Essa interface é mais útil em um cenário de trabalho em segundo plano que é instanciado apenas uma vez, mas que se beneficiaria da capacidade de lidar com alterações de configuração.

## Gerenciamento de segredos durante o desenvolvimento

Se você vai tirar alguma conclusão dEste post, que seja a seguinte:

{% capture content %}
Nunca armazene segredos em seu repositório git! Considere o uso de uma ferramenta de verificação de código como [GitHub Advanced Security](https://docs.github.com/en/enterprise-cloud@latest/get-started/learning-about-github/about-github-advanced-security), [GitHub Advanced Security for Azure DevOps](https://azure.microsoft.com/products/devops/github-advanced-security?WT.mc_id=DT-MVP-5005050) ou [GitGuardian](https://www.gitguardian.com/) para evitar que segredos sejam vazados.
{% endcapture %}
{% include callout.html type="error" title="Importante"  content=content %}

Se você armazenar segredos em seu repositório git e o repositório for comprometido, seus segredos também serão comprometidos. Acho que não preciso explicar por que isso é ruim. Então, como podemos evitar que isso aconteça com o .NET?

Usando o provedor de configuração de user secrets (segredos de usuário).

### O provedor de configuração de user secrets

Mencionei o provedor de configuração de user secrets [anteriormente](#the-defaults). Esse provedor de configuração foi criado para desenvolvimento local _somente_. Ele permite que você armazene segredos em seu computador local sem precisar se preocupar com o risco de eles serem versionados no repositório git, pois são armazenados em um local diferente:

* Windows: `%APPDATA%\Microsoft\UserSecrets\<user_secrets_id>\secrets.json`
* Mac e Linux: `~/.microsoft/usersecrets/<user_secrets_id>/secrets.json`

Esse arquivo é muito semelhante ao provedor `appsettings.json`. Basta inserir JSON nele e você poderá acessá-lo com o sistema de configuração do .NET. Quando seu aplicativo for iniciado e sua variável de ambiente `ASPNETCORE_ENVIRONMENT` ou `DOTNET_ENVIRONMENT` estiver definida como `Development`, ele carregará automaticamente o provedor de configuração de user secrets _desde que seu projeto esteja configurado para usar esse provedor_.

{% capture content %}
Mesmo que esse provedor tenha o nome “secret”, esteja avisado! O conteúdo do arquivo `secrets.json` não é criptografado. Se você trabalha em um ambiente em que armazenar segredos na própria máquina é arriscado, considere usar [um armazenamento de segredos externo como o Azure KeyVault durante o desenvolvimento](#using-the-key-vault-during-local-development).
{% endcapture %}
{% include callout.html type="warning" title="Aviso" content=content %}

Esse provedor de configuração pode ser acessado usando a CLI ou seu IDE favorito. Talvez seja necessário instalar o pacote [Microsoft.Extensions.Configuration.UserSecrets](https://www.nuget.org/packages/Microsoft.Extensions.Configuration.UserSecrets) caso você não use um `Host` ou tenha uma configuração personalizada.

### Usando User Secrets

#### CLI

Você pode usar o `dotnet` cli para interagir com user-secrets abrindo um terminal no diretório em que reside o `*.csproj` do seu projeto.

```
# Necessário apenas quando as user-secrets ainda não foram inicializadas
dotnet user-secrets init

# Você pode usar dados estruturados usando dois pontos (:) para separar as chaves
dotnet user-secrets set “ConnectionStrings:Database” “Data Source=...”
dotnet user-secrets set “AdminPassword” “hunter2”
# Outros comandos como “list”, “remove” e “clear” também estão disponíveis

```

#### Visual Studio

Clique com o botão direito do mouse em um projeto no Solution Explorer e selecione `Manage User Secrets`. Um arquivo `secrets.json` será aberto, no qual você poderá inserir seus segredos.

#### Visual Studio Code

Instale a extensão [.NET Core User Secrets Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=adrianwilczynski.user-secrets). Em seguida, você pode clicar com o botão direito do mouse em um arquivo `*.csproj` e selecionar `Manage User Secrets`. Um arquivo `secrets.json` será aberto, no qual você poderá inserir seus segredos.

#### JetBrains Rider

Clique com o botão direito do mouse em um projeto no Solution Explorer e selecione `Tools` > `Manage User Secrets`. Um arquivo `secrets.json` será aberto, no qual você poderá inserir seus segredos.

### Configurando um projeto que usa user-secrets

Uma desvantagem de usar segredos de usuário durante o desenvolvimento é que, se o seu projeto exigir alguns segredos para ser executado, será necessário executar algumas etapas de configuração após a clonagem do projeto. Tenho duas recomendações para lidar com isso:

* Você pode criar um script que recupere os segredos do seu local de armazenamento de segredos e, em seguida, armazene-os em user-secrets, canalizando esses valores para `dotnet user-secrets set`. Agora você só precisa executar esse script uma vez após clonar o projeto e pronto!
* Como alternativa, recomendo atualizar seu `README.MD` incluindo instruções de configuração que informem ao usuário quais user-secrets devem ser definidos e de onde obter esses valores. Sinta-se à vontade para criar um link para Este post se quiser explicar o que são user-secrets 😉.

## Meu modelo para gerenciamento de configuração

Agora que abordamos os conceitos básicos e o uso avançado do sistema de configuração do .NET e como incorporar o gerenciamento de segredos locais, gostaria de mostrar minha “configuração” para o gerenciamento de configuração em um projeto .NET. Quando crio um novo projeto .NET, uso a seguinte configuração:

### appsettings.json

O sistema de configuração do .NET permite que você seja muito flexível com todos os diferentes provedores. Isso é ótimo, mas também pode causar confusão quando seu aplicativo estiver usando valores de configuração que você não esperava ou quando não conseguir descobrir de onde vem um valor de configuração específico.

{% capture content %}
Use o método `IConfigurationRoot.GetDebugView()` quando estiver tendo problemas com os valores de configuração. Para fazer isso, obtenha uma instância `IConfiguration`, converta-a em `IConfigurationRoot` e inspecione o resultado de `GetDebugView()`.

Para obter mais informações, consulte o [fantástico post de Andrew Lock](https://andrewlock.net/debugging-configuration-values-in-aspnetcore/#exposing-the-debug-view-in-your-application) sobre isso.
{% endcapture %}
{% include callout.html type="tip" title="Dica" content=content %}

Eu uso `appsettings.json` para armazenar um modelo de todos os valores de configuração que meu projeto usa e de onde os valores são recuperados. Esse arquivo também pode conter valores reais quando o arquivo `appsettings.json` é o único provedor para esse valor de configuração. Gosto muito dessa configuração porque ela me permite ver todos os valores de configuração que meu projeto usa em um só lugar.

```
{
  “Logging": {
    “LogLevel": {
      “Default” (Padrão): “Informações”,
      “Microsoft.AspNetCore": “Warning”
    }
  },

  “ConnectionStrings": {
    “Database”: “<from-azure-keyvault>” // O Azure Key Vault será discutido na próxima seção
  },

  “ExternalApiSettings": {
    “ApiUrl": “<from-environment-variables>”,
    “ApiKey": “<from-azure-keyvault>”,
    “TimeoutInMilliseconds": 5000
  }
}

```


### appsettings.Development.json

A seguir, temos o arquivo `appsettings.Development.json`. Esse arquivo pode conter valores de configuração que substituem os valores do `appsettings.json`, como configurações de registro. Além disso, esse arquivo **nunca** deve conter segredos! Em vez disso, ele faz referência ao provedor de configuração de user secrets. Isso torna menos provável que as pessoas insiram segredos nesse arquivo, pois elas são levadas a usar o provedor de configuração de user secrets.

```
{
  “Logging": {
    “LogLevel": {
      “Default”: “Debug”, // As configurações de log são 100% de preferência pessoal, fique à vontade para usar o que quiser
      “Microsoft.AspNetCore": “Warning”
    }
  },

  “ConnectionStrings": {
    “Database”: “<from-user-secrets>” // Cada desenvolvedor pode usar sua própria string de conexão de banco de dados local
  },

  “ExternalApiSettings": {
    “ApiUrl": “dev.externalapi.example.com”,
    “ApiKey": “<from-user-secrets>”
    // Não forneço um valor para TimeoutInMilliseconds porque não tenho problemas com o valor de appsettings.json
  }
}

```


### User Secrets

Por fim, uso o provedor de configuração user secrets para armazenar segredos locais _e_ substituir a configuração não secreta que não quero enviar para o repositório git, como alterar as configurações de log no caso de precisar me aprofundar em um bug. Se eu alterasse esses valores de configuração no arquivo `appsettings.Development.json`, teria que me lembrar de reverter essas alterações antes de fazer o commit do meu código. Ao usar o provedor de configuração de user secrets, não preciso me preocupar com isso.

```
{
  “Logging": {
    “LogLevel": {
      “Microsoft.AspNetCore": “Information”
    }
  },

  “ConnectionStrings": {
    “Database”: “Data Source=...”
  },

  “ExternalApiSettings": {
    “ApiKey": “abc123def456ghi7”
  }
}

```

{% capture content %}
Como é a sua configuração? O que você acha da minha? Deixe sua opinião nos comentários abaixo!
{% endcapture %}
{% include callout.html type="question" title="Pergunta" content=content %}

## Usando o Azure para armazenar a configuração

Agora que sabemos como armazenar a configuração e os segredos localmente, é hora de falar sobre a execução de seus aplicativos em ambientes reais. Há muitas maneiras diferentes de configurar a configuração e o gerenciamento de segredos para ambientes não locais, portanto, tudo se resume a conhecer as vantagens e desvantagens dessas abordagens e escolher o que funciona melhor para você. Neste post, você aprenderá a usar o Azure para armazenar sua configuração e seus segredos com segurança.

{% capture content %}

Embora esta seção seja sobre o Azure, os conceitos também se aplicam a outros provedores de nuvem. O equivalente do Azure App Configuration no AWS é chamado de [AWS Systems Manager Parameter Store](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html). O Azure Key Vault tem um equivalente no AWS chamado [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/) e o equivalente do Google é chamado [Google Secret Manager](https://cloud.google.com/secret-manager).

Se quiser hospedar seu gerenciamento de segredos por conta própria, dê uma olhada em [Hashicorp Vault](https://www.vaultproject.io/).

{% endcapture %}
{% include callout.html type="info" title="Info"  content=content %}

### Armazenamento de segredos no Azure Key Vault

Como dissemos anteriormente, não é possível usar o provedor de configuração User Secrets em ambientes não locais. Portanto, temos que encontrar uma maneira diferente de armazenar nossos segredos quando estivermos implantando nossos aplicativos. O [Azure Key Vault](https://azure.microsoft.com/services/key-vault/?WT.mc_id=DT-MVP-5005050) é um ótimo serviço para armazenar segredos, chaves e certificados de forma barata, fácil e segura.

No início deste post, mencionei que é possível conectar o sistema de configuração do .NET à nuvem, o que [é possível com o Key Vault](https://learn.microsoft.com/aspnet/core/security/key-vault-configuration?WT.mc_id=DT-MVP-5005050). Essa é uma ótima abordagem para o gerenciamento de segredos porque você pode simplesmente tratar o Key Vault como um provedor de configuração e não precisa mais fazer coisas complicadas no pipeline de lançamento.

Para adicioná-lo como um provedor de configuração, instale os pacotes [Azure.Extensions.AspNetCore.Configuration.Secrets](https://www.nuget.org/packages/Azure.Extensions.AspNetCore.Configuration.Secrets) e [Azure.Identity](https://www.nuget.org/packages/Azure.Identity). Em seguida, você só precisará adicionar algumas linhas de código ao seu `Program.cs` quando criar uma API mínima, por exemplo:

{% highlight c# %}
usando Azure.Identity;

var builder = WebApplication.CreateBuilder(args);

builder.Host.ConfigureAppConfiguration((context, config) =>
{
    se (!context.HostingEnvironment.IsDevelopment())
    {
        var keyVaultUrl = new Uri(context.Configuration.GetValue<string>(“KeyVaultUrl”));
        config.AddAzureKeyVault(keyVaultUrl, new ManagedIdentityCredential()); // Há outras opções de credenciais disponíveis. As Managed Identities serão abordadas em breve!
    }
});

{% endhighlight %}


O Key Vault agora é adicionado como o provedor final e, portanto, tem [a prioridade mais alta](#the-defaults). Portanto, mesmo que outros provedores tenham um valor configurado para um segredo, o Key Vault será usado em seu lugar!

{% capture content %}
Os segredos estruturados devem ser armazenados no Key Vault com 2 traços (`--`) em vez de 2 sublinhados ou dois pontos devido a limitações de nomenclatura. Por exemplo, `ExternalApiSettings--ApiKey` em vez de `ExternalApiSettings:ApiKey` ou `ExternalApiSettings__ApiKey`.
{% endcapture %}
{% include callout.html type="info" title="Info"  content=content %}

#### Usando o Key Vault durante o desenvolvimento local

Anteriormente neste post, mencionei brevemente que você pode estar em um cenário em que não é possível armazenar segredos em seu computador por motivos de segurança, por exemplo. Nesse caso, usar o Key Vault durante o desenvolvimento local resolveria esse problema. Você pode pegar o exemplo de código da seção anterior e modificá-lo da seguinte forma:

{% highlight c# %}
usando Azure.Identity;

var builder = WebApplication.CreateBuilder(args);

builder.Host.ConfigureAppConfiguration((context, config) =>
{
    var keyVaultUrl = new Uri(context.Configuration.GetValue<string>(“KeyVaultUrl”));
    config.AddAzureKeyVault(keyVaultUrl, new DefaultAzureCredential()); // Esses tipos de credenciais serão abordados a seguir!
});

{% endhighlight %}


Agora, seu aplicativo sempre se conectará ao Key Vault, mesmo durante o desenvolvimento. O resultado é que você não precisa mais armazenar segredos em seu computador, pois eles são sempre recuperados do Key Vault. Uma desvantagem dessa abordagem é que você sempre precisa de uma conexão com a Internet para se conectar à nuvem!

{% capture content %}
Devido aos benefícios que essa solução traz, considere o uso dessa abordagem mesmo em cenários em que o armazenamento de segredos localmente seria aceitável. Um grande benefício dessa abordagem é que você pode simplesmente clonar um projeto e, desde que tenha as permissões corretas, pode executá-lo sem precisar configurar nenhum segredo em sua máquina, pois eles são simplesmente recuperados da nuvem!
{% endcapture %}
{% include callout.html type="info" title="Info"  content=content %}

### Conectando-se ao Azure com identidades gerenciadas

Nos exemplos de código anteriores, você viu alguns tipos estranhos de credenciais: `ManagedIdentityCredential` e `DefaultAzureCredential`. Antes de discutirmos isso, considere o seguinte:

Queremos nos conectar a um provedor de armazenamento seguro de segredos para obter segredos com os quais executar nosso aplicativo. Para nos conectarmos a esse provedor, precisaremos passar algumas credenciais para que o provedor possa autorizar nossa solicitação. **Mas essas credenciais também são segredos, então onde as armazenamos**? Poderíamos armazená-las em outro provedor de configuração, mas isso não anula todo o propósito de ter um provedor secreto? Se essas credenciais vazassem, alguém poderia acessar nossos segredos de qualquer forma! **Para resumir, estamos lidando com um problema de galinha e ovo**.

Felizmente, algumas pessoas inteligentes da Microsoft descobriram isso! Para o desenvolvimento local, você pode usar o `DefaultAzureCredential` para se comunicar com os serviços do Azure. Esse tipo de credencial tentará se autenticar [usando vários métodos](https://learn.microsoft.com/dotnet/api/overview/azure/identity-readme?WT.mc_id=DT-MVP-5005050#defaultazurecredential), como a conta da Microsoft com a qual você está conectado ao seu IDE, suas credenciais da CLI do Azure (`az`) e muito mais.

![Uma visão geral de como a Identidade do Azure funciona](/img/configuracao-dotnet/azure-identity.webp)

A Identidade do Azure usa vários métodos para autenticar a conta do Azure de um desenvolvedor.  

Para ambientes de produção, a Microsoft recomenda [Managed Identities](https://docs.microsoft.com/azure/active-directory/managed-identities-azure-resources/overview) para [autenticar com recursos do Azure](https://learn.microsoft.com/dotnet/azure/sdk/authentication/?WT.mc_id=DT-MVP-5005050). As identidades gerenciadas são um recurso do Microsoft Entra (anteriormente conhecido como Azure Active Directory) que permite criar uma identidade para seu aplicativo no Microsoft Entra. Essa identidade pode ser usada para autenticação em outros serviços do Azure, como o Key Vault. A vantagem dessa abordagem é que você não precisa mais armazenar nenhuma credencial no aplicativo, pois a identidade é gerenciada pelo Azure AD.

![Um diagrama de como as Identidades Gerenciadas funcionam.</br>](/img/configuracao-dotnet/azure-managed-identities.webp)

{% capture content %}
As Managed Identities podem ser bastante difíceis de entender em um primeiro momento. Dê uma olhada na parte inferior do post para ver alguns links com mais informações sobre Managed Identities.
{% endcapture %}
{% include callout.html type="info" title="Info"  content=content %}

### Armazenamento da configuração na Configuração de Aplicativo do Azure

Por último, mas não menos importante, quero falar sobre a oferta de nuvem do Azure para gerenciamento de _configuração_. Enquanto o Azure Key Vault abrange o gerenciamento de segredos, o [Azure App configuration](https://azure.microsoft.com/products/app-configuration/?WT.mc_id=DT-MVP-5005050) é uma oferta de SaaS que o ajudará a gerenciar sua configuração. Esses dois serviços funcionam muito bem juntos quando você vincula o Azure App Configuration ao Azure Key Vault. Se optar por usar esse serviço, você só precisará adicionar o [Azure App Configuration como um provedor de configuração](https://learn.microsoft.com/azure/azure-app-configuration/quickstart-aspnet-core-app?WT.mc_id=DT-MVP-5005050) e, em seguida, poderá usar o sistema de configuração do .NET para acessar todas as suas configurações E segredos da nuvem!

Ele também tem muitos outros recursos, portanto, vale a pena dar uma olhada!

{% capture content %}
 
Considere a possibilidade de usar [identidades gerenciadas para acessar a Configuração de Aplicativos](https://learn.microsoft.com/pt-br/azure/azure-app-configuration/howto-integrate-azure-managed-service-identity?WT.mc_id=DT-MVP-5005050&pivots=framework-dotnet) para aumentar a segurança!

{% endcapture %}
{% include callout.html type="info" title="Info"  content=content %}

## Finalizando

Você chegou até o fim! Este post levou muito tempo para ser escrito, e estou feliz por finalmente ter sido concluído! Abaixo, você encontrará mais informações se quiser saber mais sobre os conceitos que abordei neste post. Se você tiver alguma dúvida, fique à vontade para deixar um comentário abaixo. Se quiser saber quando e onde darei a versão de palestra deste post, confira minha página [Speaking](https://stenbrinke.nl/speaking).

### Links para a demo

Mencionei que o post é um complemento de uma de minhas sessões. Essa sessão contém várias demonstrações que mostram os conceitos discutidos nEste post. Você pode encontrar as demonstrações [aqui](https://github.com/sander1095/secure-secret-storage-with-asp-net-core/).

### Links para a documentação oficial

* [Configuração](https://learn.microsoft.com/dotnet/core/extensions/configuration?WT.mc_id=DT-MVP-5005050)
* [Configuração (especificações do ASP.NET Core)](https://learn.microsoft.com/aspnet/core/fundamentals/configuration?WT.mc_id=DT-MVP-5005050)
* [options pattern](https://learn.microsoft.com/aspnet/core/fundamentals/configuration/options?WT.mc_id=DT-MVP-5005050)
* [user secrets](https://docs.microsoft.com/aspnet/core/security/app-secrets)
* [Azure KeyVault](https://azure.microsoft.com/en-us/products/key-vault/?WT.mc_id=DT-MVP-5005050)
* [Mais informações sobre Managed Identities](https://devblogs.microsoft.com/devops/demystifying-service-principals-managed-identities/?WT.mc_id=DT-MVP-5005050)

* * *

Você gostou deste post? [![Faça uma doção para o autor original em https://ko-fi.com/stenbrinke.nl](https://stenbrinke.nl/images/kofi_button_blue.webp)](https://ko-fi.com/stenbrinke)

## Carlos de volta

Carlos Schults de volta aqui. Espero que tenham gostado bastante do post, e sugiro que o coloquem nos favoritos para ser um recurso útil de consulta toda vez que surgir alguma dúvida referente ao gerenciamento de secrets e configuração.

Agradeço a Sander ten Brinke, autor do artigo original, que gentilmente me autorizou a traduzí-lo. O [blog dele](https://stenbrinke.nl/) é fantástico, tem muitos artigos extremamente bem escritos sobre diversos tópicos relacionados a .NET. Para quem sabe inglês, recomendo fortemente a visita.

Gostaria de agradecer também a [Andrew Lock](https://andrewlock.net/about/), o autor do livro [ASP.NET Core in Action](https://www.manning.com/books/asp-net-core-in-action-third-edition), por ter concedido autorização para reproduzir uma imagem de seu livro. 

A você que leu o artigo - todo ou apenas uma parte — deixo também um agradecimento e um pedido: me dê seu feedback. É extremamente importante saber se as pessoas gostam desse tipo de conteúdo, pois me motiva a continuar produzindo.

Até a próxima!
