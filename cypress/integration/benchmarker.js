let lists = require("../../lists");
let search = Cypress.env('search') || "regras checkin azul linhas";
let queries = [];
if(search){
    search
        .replace(", ",",")
        .split(",").forEach((query) => queries.push(query));
}
// let queries = [
//     "preço da bagagem ${ciaBr}",
//     // "baggage price ${ciaEn}"
// ];

// let regexList = /\$\{(.*?)\}/;
let regexList = /\[\[(.*?)\]\]/;

// desabilita erros globais
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false
});
Cypress.Commands.overwrite('log', (subject, message) => cy.task('log', message));
Cypress.Commands.add(
    'paste', {
        prevSubject: true,
        element: true
    }, ($element, text) => {
        const subString = text.substr(0, text.length - 1);
        const lastChar = text.slice(-1);

        $element.text(subString);
        $element.val(subString);
        cy.get($element).type(lastChar);
    }
);

Cypress.Commands.overwrite('visit', (orig, url, options = {}) => {
  const parentDocument = cy.state("window").parent.document
  const iframe = parentDocument.querySelector(".iframes-container iframe")
  if (false === options.script) {
    if (false !== Cypress.config("chromeWebSecurity")) {
      throw new TypeError("When you disable script you also have to set 'chromeWebSecurity' in your config to 'false'")
    }
    iframe.sandbox = ""
  } else {
    // In case it was added by a visit before, the attribute has to be removed from the iframe
    iframe.removeAttribute("sandbox")
  }
  return orig(url, options);
});

let goToSiteAndPrint = function(query, search){






    cy.viewport("macbook-11");

    cy.visit('https://www.google.com/', { followRedirect: false });
    cy.get("input[name=q]").paste(query);
    cy.get(`[name="btnI"]`).first().click({ force: true });

    cy.window().then((win) => {
        cy.log("pre");
        function loadScript(url, callback){
            // Adding the script tag to the head as suggested before
            var head = document.head;
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;

            // Then bind the event to the callback function.
            // There are several events for cross browser compatibility.
            script.onreadystatechange = callback;
            script.onload = callback;

            // Fire the loading
            head.appendChild(script);
            win.document.body.innerHTML += `<p>teste</p>`

            console.log(script);
            console.log(head);

            cy.log(head);
            cy.log(script);
        }
        loadScript("https://github.com/niklasvh/html2canvas/releases/download/v1.0.0-rc.6/html2canvas.min.js", function () {

            console.log('eppaaaaa')
            console.log(html2canvas)
            cy.log("aqui");
            html2canvas(win.document.querySelector(".TCSS__container__no-banner--130")).then(canvas => {
                document.body.appendChild(canvas);
                console.log(canvas);
            });
            cy.log("ae");

        });

        // win.document.querySelectorAll("[style*=height]").forEach((styled)=>{
        //     styled.style.height = null;
        // });
    });














    return;
    cy.viewport("macbook-11");

    // cy.visit(`https://www.google.com/search?q=${query}`);
    // cy.get("#search .g:first-child a").first().click({ force: true });

    cy.visit('https://www.google.com/', { followRedirect: false });
    cy.get("input[name=q]").paste(query);
    cy.get(`[name="btnI"]`).first().click({ force: true });

    cy.window().then((win) => {
        // win.document.querySelectorAll("[style*=height]").forEach((styled)=>{
        //     styled.style.height = null;
        // });
    });
    cy.wait(1500);

    cy.screenshot(`${search}/desktop ${query}`, {
        capture: "fullPage",
        // scale: true,
    });
    cy.viewport("iphone-6");
    // cy.get('body').type('{alt}{shift}!', { release: false });
    cy.reload();
    cy.wait(1500);
    cy.screenshot(`${search}/mobile ${query}-`, {
        capture: "fullPage",
        // scale: true,
    });
}

describe('Generate print screens', () => {
    it(`Generate print screens`, () => {

        cy.on('uncaught:exception', (err, runnable) => {
            expect(err.message).to.include('something about the error');
            done();
            // return false to prevent the error from
            // failing this test
            return false
        })

        queries.forEach((query)=>{
            // Se o termo inputado contém um valor dinâmico, gera um array para cada permutação
            if(query.match(regexList)) {
                cy.log(`dynamic query: ${query}`);
                let list = query.match(regexList)[1];

                // pega a lista dinâmica e permuta as variações
                lists[list].forEach((item) => {
                    let newQuery = query.replace(regexList, item);
                    cy.log(`gotoSiteAndPrint: ${newQuery}`)
                    goToSiteAndPrint(newQuery, search);
                });
            } // Caso contrário, só printa o site
            else {
                cy.log(`static query: ${query}`)
                goToSiteAndPrint(query, search);
            }
        });

    });
})
