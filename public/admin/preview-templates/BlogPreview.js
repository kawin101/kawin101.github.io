var BlogPreview = createClass({
    render: function () {
        var entry = this.props.entry;
        var image = entry.getIn(['data', 'thumbnail']);
        var bgImage = this.props.getAsset(image);
        var title = entry.getIn(['data', 'title']);
        var date = entry.getIn(['data', 'date']);
        var body = entry.getIn(['data', 'body']);
        var imagePosition = entry.getIn(['data', 'image_position']) || 'center center';

        return h('div', { className: "bg-white min-vh-100 py-5" },
            h('div', { className: "container py-5 mt-5" },
                h('article', { className: "mx-auto", style: { maxWidth: '800px' } },
                    h('div', { className: "mb-5 text-center" },
                        h('h1', { className: "display-4 fw-bold mb-3" }, title),
                        h('p', { className: "text-muted" }, date ? date.toString() : '')
                    ),
                    image ? h('div', { className: "mb-5 rounded overflow-hidden shadow-sm", style: { height: '400px' } },
                        h('img', {
                            src: bgImage.toString(),
                            className: "w-100 h-100",
                            style: { objectFit: 'cover', objectPosition: imagePosition }
                        })
                    ) : null,
                    h('div', { className: "markdown-content lead text-secondary" }, this.props.widgetFor('body'))
                )
            )
        );
    }
});

CMS.registerPreviewTemplate('blog', BlogPreview);
