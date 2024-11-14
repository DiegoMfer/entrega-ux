$(document).ready(function() {
    // Define the Levenshtein distance function
    function levenshteinDistance(a, b) {
        const matrix = [];
        for (let i = 0; i <= b.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= a.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // substitution
                        matrix[i][j - 1] + 1,     // insertion
                        matrix[i - 1][j] + 1      // deletion
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }

    $('#search-button').on('click', function(event) {
        event.preventDefault(); // Prevents page reload
        const searchTerm = $('#search-input').val().toLowerCase();
        if (searchTerm) {
            $('#search-results').empty(); // Clear previous results

            // Hardcoded sitemap content
            const sitemap = {
                site: {
                    page: [
                        {
                            url: 'index.html',
                            title: 'Página Principal - Diego Martín Fernández',
                            content: 'Sobre Mí Hola, soy Diego Martín Fernández, un ingeniero de software apasionado...'
                        },
                        {
                            url: 'curriculum.html',
                            title: 'Currículum - Diego Martín Fernández',
                            content: 'Mis proyectos - RDF in Zarr Proyecto de investigación sobre motores RDF...'
                        },
                        {
                            url: 'sobre_mi.html',
                            title: 'Sobre Mí - Diego Martín Fernández',
                            content: 'Hola, soy Diego Martín Fernández, un ingeniero de software apasionado por la tecnología...'
                        }
                    ]
                }
            };

            const results = [];
            const maxDistance = 1; // Define the maximum allowable distance for a "match"

            sitemap.site.page.forEach(function(page) {
                const title = page.title;
                const url = page.url;
                const content = page.content.toLowerCase();

                // Calculate Levenshtein distance between searchTerm and content substring
                let matchFound = false;
                for (let i = 0; i < content.length - searchTerm.length + 1; i++) {
                    const substring = content.substring(i, i + searchTerm.length);
                    const distance = levenshteinDistance(searchTerm, substring);
                    if (distance <= maxDistance) {
                        matchFound = true;
                        break;
                    }
                }

                if (matchFound) {
                    results.push({
                        title: title,
                        url: url,
                        snippet: content.substring(0, 150) + '...'
                    });
                }
            });

            // Display results
            if (results.length > 0) {
                results.forEach(result => {
                    $('#search-results').append(`
                        <div class="search-result">
                            <h3><a href="${result.url}">${result.title}</a></h3>
                            <p>${result.snippet}</p>
                        </div>
                    `);
                });
            } else {
                $('#search-results').append('<p>No se encontraron resultados.</p>');
            }
        }
    });
});
