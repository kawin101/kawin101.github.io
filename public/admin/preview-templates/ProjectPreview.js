var ProjectPreview = createClass({
    render: function () {
        var entry = this.props.entry;
        var image = entry.getIn(['data', 'thumbnail']);
        var bgImage = this.props.getAsset(image);
        var title = entry.getIn(['data', 'title']);
        var startDate = entry.getIn(['data', 'startDate']);
        var endDate = entry.getIn(['data', 'endDate']);
        var current = entry.getIn(['data', 'current']);
        var tags = entry.getIn(['data', 'tags']);
        var projectUrl = entry.getIn(['data', 'projectUrl']);
        var repoUrl = entry.getIn(['data', 'repoUrl']);
        var pdfUrl = entry.getIn(['data', 'pdfUrl']);
        var appStoreUrl = entry.getIn(['data', 'appStoreUrl']);
        var playStoreUrl = entry.getIn(['data', 'playStoreUrl']);
        var imagePosition = entry.getIn(['data', 'image_position']) || 'center center';

        var dateString = '';
        if (startDate) {
            dateString += new Date(startDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
        }
        if (current) {
            dateString += ' - Present';
        } else if (endDate) {
            dateString += ' - ' + new Date(endDate).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
        }

        return h('div', { className: "bg-white min-vh-100 py-5" },
            h('div', { className: "container py-5 mt-5" },
                h('article', { className: "mx-auto", style: { maxWidth: '800px' } },
                    h('div', { className: "mb-5 text-center" },
                        h('h1', { className: "display-4 fw-bold mb-3" }, title),
                        h('div', { className: "d-flex justify-content-center gap-3 text-muted flex-wrap" },
                            h('span', {},
                                h('i', { className: "far fa-calendar-alt me-1" }),
                                dateString
                            ),
                            tags ? tags.map(function (tag) {
                                return h('span', { key: tag, className: "badge bg-surface text-secondary border rounded-pill px-3" }, tag);
                            }) : null
                        )
                    ),
                    image ? h('div', { className: "mb-5 rounded overflow-hidden shadow-sm", style: { height: '400px' } },
                        h('img', {
                            src: bgImage.toString(),
                            className: "w-100 h-100",
                            style: { objectFit: 'cover', objectPosition: imagePosition }
                        })
                    ) : null,
                    h('div', { className: "markdown-content text-secondary mb-5" }, this.props.widgetFor('content')),

                    h('div', { className: "d-flex flex-wrap gap-3 justify-content-center pt-5 border-top" },
                        projectUrl ? h('a', { href: projectUrl, className: "btn btn-primary rounded-pill px-5 shadow-sm" }, 'Live Demo') : null,
                        repoUrl ? h('a', { href: repoUrl, className: "btn btn-outline-dark rounded-pill px-5 shadow-sm" }, 'View Code') : null,
                        pdfUrl ? h('a', { href: pdfUrl, className: "btn btn-outline-danger rounded-pill px-5 shadow-sm" }, 'Documentation') : null
                    ),

                    (appStoreUrl || playStoreUrl) ? h('div', { className: "d-flex gap-4 mt-5 justify-content-center" },
                        appStoreUrl ? h('a', { href: appStoreUrl }, h('img', { src: "/assets/badge-appstore.png", height: "45" })) : null,
                        playStoreUrl ? h('a', { href: playStoreUrl }, h('img', { src: "/assets/badge-playstore.png", height: "45" })) : null
                    ) : null
                )
            )
        );
    }
});

CMS.registerPreviewTemplate('projects', ProjectPreview);
CMS.registerPreviewStyle("https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css");
CMS.registerPreviewStyle("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");
CMS.registerPreviewStyle("/admin/cms.css");
