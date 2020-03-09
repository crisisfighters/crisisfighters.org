function renderInitiatives(tableId, {data, fields}) {
    
    document.querySelector(`#${tableId} tbody`)
        .insertAdjacentHTML(
            'beforeend',
            Object.keys(fields)
                .reduce(
                    (acc, group) => [
                        [
                            ...acc[0],
                            `<th class="${group}" colspan="${Object.keys(fields[group].children).length}">${fields[group].title}</th>`
                        ],
                        [
                            ...acc[1],
                            ...Object.keys(fields[group].children).map(field => `<th class="${group}">${fields[group].children[field].title}</th>`),
                        ],
                    ],
                    [[], []]
                )
                .map(thSet => `<tr>${thSet.join('\n')}</tr>`)
                .join('\n'));
    const flatFields = Object.keys(fields)
        .reduce(
            (acc, group) => ({
                ...acc,
                ...fields[group].children
            }),
            {});
    const md = window.markdownit();
    const render = (value, initiative) =>
        `<td>${
            value === undefined
                ? '-'
                : value.name && value.link
                ? `<p><a href="${value.link}">${value.name}</a></p>`
                : value.name
                    ? value.name
                    // TODO update link
                    : `<span class="updated">${value.updatedBy} (<a href="https://github.com/crisisfighters/initiatives/pulls?q=is%3Apr+label%3A${initiative.meta.label}">${value.updatedAt}</a>):</span>${
                        md.render(value.content)
                        }`
            }</td>`
    ;
    document.querySelector(`#${tableId} tbody`)
        .insertAdjacentHTML(
            'beforeend',
            data.map(initiative => `<tr>${
                Object.keys(flatFields)
                    .map(field => render(initiative[field], initiative))
                    .join('')
                }</tr>`)
                .join('\n')
        );
};