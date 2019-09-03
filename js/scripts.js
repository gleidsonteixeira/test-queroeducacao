//MOSTRAR/ESCONDER MENU
$(".menu-btn").click(function(){
    $(".menu nav ul").slideToggle("fast");
});

//ABRE MODAL DE BUSCA
$(".add-bolsa").click(function(){
    $(".modal").addClass("active");
});

//FECHA MODAL DE BUSCA
$(".fechar, .cancelar").click(function(){
    $(".modal").removeClass("active");
});

//VERIFICA SE TEM CHECKBOX MARCADOS PARA HABILITAR O BOTÃO "CONFIRMAR"
$(document).on("click", "#resultados input", function(){
    var selecionados = 0;
    $("#resultados input").each(function(){
        if($(this).prop("checked")){
            selecionados += 1;
        }
    });
    if(selecionados > 0){
        $(".modal form .confirmar").addClass("active");
        $(".modal form .confirmar").removeClass("inactive");
        $(".modal form .confirmar").prop("disabled", false);
    }else{
        $(".modal form .confirmar").addClass("inactive");
        $(".modal form .confirmar").removeClass("active");
        $(".modal form .confirmar").prop("disabled", true);
    }
});

//EXCLUI BOLSAS QUE ESTÃO NA LISTA
$(document).on("click", "#bolsas-selecionadas li .excluir", function(){
    var id = $(this).attr("data-id");
    $('#bolsas-selecionadas li[data-id='+id+']').remove();
});

//CARREGA LISTA DE CURSOS NA BUSCA
function listaCursos(){
    var link = "https://testapi.io/api/redealumni/scholarships";
    var listaDeCursos;
    var opcoesCidades = [];
    var opcoesCursos = [];
    //REQUISIÇÃO PARA O LINK EXTERNO
    $.get(link, function (obj) {
        listaDeCursos = obj.sort(function(a, b){
            var x = a.university.name.toLowerCase();
            var y = b.university.name.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
        });
        if(listaDeCursos.length == 0){
            
        }else{
            var resultados = document.getElementById('resultados');
            $("#resultados").empty();
            listaDeCursos.forEach(function(o){
                opcoesCidades.push(o.campus.city);
                opcoesCursos.push(o.course.name);
                var item = document.createElement('li');
                    item.setAttribute("data-id", obj.indexOf(o));
                    item.setAttribute("data-cidade", o.campus.city);
                    item.setAttribute("data-curso", o.course.name);
                    item.setAttribute("data-tipo", o.course.kind);
                    item.setAttribute("data-valor", Math.round(o.price_with_discount));
                var html =  '<div class="checkbox">'+
                                '<span>'+
                                    '<input type="checkbox" data-id="'+obj.indexOf(o)+'">'+
                                '</span>'+
                            '</div>'+
                            '<figure>'+
                                '<img src="'+o.university.logo_url+'">'+
                            '</figure>'+
                            '<div class="infos">'+
                                '<h6 class="curso-nome"><b class="azul-s-text">'+o.course.name+'</b></h6>'+
                                '<h6 class="curso-tipo">'+o.course.level+'</h6>'+
                                '<h6 class="curso-desconto">Bolsa de <b class="verde-text">'+Math.round(o.discount_percentage)+'%</b></h6>'+
                                '<h6 class="curso-valor"><b class="verde-text">R$ '+Math.round(o.price_with_discount)+'/mês</b></h6>'+
                            '</div>';
                item.innerHTML = html;
                resultados.appendChild(item);
            });
        }
    }).done(function(){
        //CARREGA O FILTRO DAS CIDADES
        opcoesCidades.sort();
        const cidadesUnicas = [new Set(opcoesCidades)];
        cidadesUnicas.sort();
        cidadesUnicas[0].forEach(function(ci){
            var cidades = document.getElementById('listaCidades');
            var item = document.createElement('option');
            var html = ci;
            item.innerHTML = html;
            cidades.appendChild(item);
        });
        //CARREGA O FILTRO DOS CURSOS
        opcoesCursos.sort();
        const cursosUnicos = [new Set(opcoesCursos)];
        var cursos = document.getElementById('listaCursos');
        var itemVazio = document.createElement('option');
        var html = '';
        itemVazio.innerHTML = html;
        cursos.appendChild(itemVazio);
        cursosUnicos[0].forEach(function(ci){
            var item = document.createElement('option');
            var html = ci;
            item.innerHTML = html;
            cursos.appendChild(item);
        });
        //FILTRO INICIAL
        var cidadeSelecionada = $("#listaCidades option:selected").text().toLowerCase().replace(/\s/g,'');
        $("#resultados li").each(function(){
            var cidade = $(this).attr("data-cidade").toLowerCase().replace(/\s/g,'');
            if(cidade == cidadeSelecionada){
                $(this).addClass("city-on");
            }else{
                $(this).addClass("city-off");
            }
        });
        //FILTRA POR CIDADE
        $("#listaCidades").change(function(){
            var cidadeSelecionada = $("#listaCidades option:selected").text().toLowerCase().replace(/\s/g,'');
            $("#resultados li").removeClass("city-off");
            $("#resultados li").each(function(){
                var cidade = $(this).attr("data-cidade").toLowerCase().replace(/\s/g,'');
                if(cidade == cidadeSelecionada){
                    $(this).addClass("city-on");
                }else{
                    $(this).addClass("city-off");
                }
            });
        });
        //FILTRA POR CURSO
        $("#listaCursos").change(function(){
            var cursoSelecionado = $("#listaCursos option:selected").text().toLowerCase().replace(/\s/g,'');
            $("#resultados li.city-on").removeClass("curso-off");
            $("#resultados li.city-on").each(function(){
                var curso = $(this).attr("data-curso").toLowerCase().replace(/\s/g,'');
                if(curso == cursoSelecionado || '' == cursoSelecionado){
                    $(this).addClass("curso-on");
                }else{
                    $(this).addClass("curso-off");
                }
            });
        });
        //FILTRA POR TIPO PRESENCIAL
        $(".presencial").click(function(){
            if($(this).prop("checked")){
                $("#resultados li.city-on[data-tipo=Presencial]").removeClass("presencial-off");
                $("#resultados li.city-on[data-tipo=Presencial]").addClass("presencial-on");
            }else{
                $("#resultados li.city-on[data-tipo=Presencial]").removeClass("presencial-on");
                $("#resultados li.city-on[data-tipo=Presencial]").addClass("presencial-off");
            }
        });
        //FILTRA POR TIPO EAD
        $(".ead").click(function(){
            if($(this).prop("checked")){
                $("#resultados li.city-on[data-tipo=EaD]").removeClass("ead-off");
                $("#resultados li.city-on[data-tipo=EaD]").addClass("ead-on");
            }else{
                $("#resultados li.city-on[data-tipo=EaD]").removeClass("ead-on");
                $("#resultados li.city-on[data-tipo=EaD]").addClass("ead-off");
            }
        });
        //FILTRA POR VALOR
        $(".valor-max-input").change(function(){
            $(".valor-max span").text($(this).val());
            var valorSelecionado = $(this).val();
            $("#resultados li.city-on").removeClass("valor-off");
            $("#resultados li.city-on").each(function(){
                var valor = $(this).attr("data-valor");
                if(parseInt(valor) < parseInt(valorSelecionado)){
                    $(this).addClass("valor-on");
                    // console.log(valor)
                    // console.log(valorSelecionado)
                    // console.log("menor")
                }else{
                    $(this).addClass("valor-off");
                }
            });

        });
    });

    //EVITA QUE O FORM SEJA SUBMETIDO
    $(".modal form").submit(function(e){
        e.preventDefault();
    });

    //AO CLICAR EM CONFIRMAR
    $(".confirmar").click(function(){
        //ESCODE O MODAL
        $(".modal").removeClass("active");
        //CARREGA BOLSAS SELECIONADAS NA LISTA
        var bolsasSelecionadas = document.getElementById('bolsas-selecionadas');
        //LIMPA A LISTA ANTES DE POPULAR
        $("#bolsas-selecionadas").empty();
        $("#resultados li").each(function(){
            if($(this).find("input").prop("checked")){
                var id = $(this).attr("data-id");
                var nota;
                var item = document.createElement('li');
                
                item.classList.add("branco");
                item.setAttribute("data-id", id);
                
                if(listaDeCursos[id].university.score == 0){
                    nota = '<i class="amarelo-p-text fa fa-star-o"></i><i class="amarelo-p-text fa fa-star-o"></i><i class="amarelo-p-text fa fa-star-o"></i><i class="amarelo-p-text fa fa-star-o"></i><i class="amarelo-p-text fa fa-star-o"></i>';
                }else if(listaDeCursos[id].university.score < 1){
                    nota = '<i class="amarelo-p-text fa fa-star-half-o"></i><i class="amarelo-p-text fa fa-star-o"></i><i class="amarelo-p-text fa fa-star-o"></i><i class="amarelo-p-text fa fa-star-o"></i><i class="amarelo-p-text fa fa-star-o"></i>';
                }else if(listaDeCursos[id].university.score == 1){
                    nota = '<i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star-o"></i><i class="amarelo-p-text fa fa-star-o"></i><i class="amarelo-p-text fa fa-star-o"></i><i class="amarelo-p-text fa fa-star-o"></i>';
                }else if(listaDeCursos[id].university.score > 1 && listaDeCursos[id].university.score < 2){
                    nota = '<i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star-half-o"></i><i class="amarelo-p-text fa fa-star-o"></i><i class="amarelo-p-text fa fa-star-o"></i><i class="amarelo-p-text fa fa-star-o"></i>';
                }else if(listaDeCursos[id].university.score == 2){
                    nota = '<i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star-o"></i><i class="amarelo-p-text fa fa-star-o"></i><i class="amarelo-p-text fa fa-star-o"></i>';
                }else if(listaDeCursos[id].university.score > 2 && listaDeCursos[id].university.score < 3){
                    nota = '<i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star-half-o"></i><i class="amarelo-p-text fa fa-star-o"></i><i class="amarelo-p-text fa fa-star-o"></i>';
                }else if(listaDeCursos[id].university.score == 3){
                    nota = '<i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star-o"></i><i class="amarelo-p-text fa fa-star-o"></i>';
                }else if(listaDeCursos[id].university.score > 3 && listaDeCursos[id].university.score < 4){
                    nota = '<i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star-half-o"></i><i class="amarelo-p-text fa fa-star-o"></i>';
                }else if(listaDeCursos[id].university.score == 4){
                    nota = '<i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star-o"></i>';
                }else if(listaDeCursos[id].university.score > 4 && listaDeCursos[id].university.score < 5){
                    nota = '<i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star-half-o"></i>';
                }else{
                    nota = '<i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star"></i><i class="amarelo-p-text fa fa-star"></i>';
                }

                var html =  '<img src="'+listaDeCursos[id].university.logo_url+'" alt="logo-anhanguera">'+
                            '<h6 class="curso-instituicao upper">'+listaDeCursos[id].university.name+'</h6>'+
                            '<h6 class="curso-nome azul-s-text">'+listaDeCursos[id].course.name+'</h6>'+
                            '<div class="avaliacoes">'+
                                '<span class="curso-nota">'+listaDeCursos[id].university.score+'</span>'+
                                nota+
                            '</div>'+
                            '<div class="periodo">'+
                                '<h6 class="upper">'+listaDeCursos[id].course.kind+'<span></span>'+listaDeCursos[id].course.shift+'</h6>'+
                                '<p>Início das aulas em: '+listaDeCursos[id].start_date+'</p>'+
                            '</div>';
                if(listaDeCursos[id].enabled == true){
                    html += '<div class="mensalidade">'+
                                '<h6>Mensalidade com o Quero Bolsa:</h6>'+
                                '<span><strike>R$ '+listaDeCursos[id].full_price.toFixed(2)+'</strike></span>'+
                                '<h5><b class="verde-text">R$ '+listaDeCursos[id].price_with_discount.toFixed(2)+'</b> /mês</h5>'+
                            '</div>'+
                            '<button class="esquerda excluir" data-id="'+id+'">Excluir</button>'+
                            '<button class="direita active">Ver oferta</button>';
                }else{
                    html += '<div class="mensalidade">'+
                                '<h6>Bolsa indisponível.</h6>'+
                                '<p>Entre em contato com nosso atendimento para saber mais.</p>'+
                            '</div>'+
                            '<button class="esquerda excluir" data-id="'+id+'">Excluir</button>'+
                            '<button class="direita inactive">Indisponível</button>';
                }
                item.innerHTML = html;
                bolsasSelecionadas.appendChild(item);
            }
        });
    });
}listaCursos();