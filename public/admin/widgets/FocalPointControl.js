const FocalPointControl = createClass({
    handleChange: function (e) {
        const startX = e.nativeEvent.offsetX;
        const startY = e.nativeEvent.offsetY;
        const width = e.target.offsetWidth;
        const height = e.target.offsetHeight;

        // Calculate percentage
        const x = Math.round((startX / width) * 100);
        const y = Math.round((startY / height) * 100);

        const value = `${x}% ${y}%`;
        this.props.onChange(value);
    },

    render: function () {
        const { value, entry } = this.props;
        const imagePath = entry.getIn(['data', 'thumbnail']);
        const bgImage = imagePath ? this.props.getAsset(imagePath).toString() : '';

        // Parse current value or default to center
        let left = '50%';
        let top = '50%';

        if (value) {
            const parts = value.split(' ');
            if (parts.length === 2) {
                left = parts[0];
                top = parts[1];
            }
        }

        if (!bgImage) {
            return h('div', { className: 'text-muted' }, 'Please select a Thumbnail image first to set the focal point.');
        }

        return h('div', { style: { position: 'relative', display: 'inline-block', border: '2px solid #ddd', cursor: 'crosshair' } },
            h('img', {
                src: bgImage,
                style: { maxWidth: '100%', maxHeight: '400px', display: 'block' },
                onClick: this.handleChange,
                draggable: false
            }),
            h('div', {
                style: {
                    position: 'absolute',
                    left: left,
                    top: top,
                    width: '20px',
                    height: '20px',
                    backgroundColor: 'rgba(255, 0, 0, 0.7)',
                    border: '2px solid white',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'none',
                    boxShadow: '0 0 4px rgba(0,0,0,0.5)'
                }
            })
        );
    }
});

const FocalPointPreview = createClass({
    render: function () {
        return h('div', {}, 'Focal Point: ' + (this.props.value || 'Center Center'));
    }
});

CMS.registerWidget('focal_point', FocalPointControl, FocalPointPreview);
