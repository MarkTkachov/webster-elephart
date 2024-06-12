import Konva from 'konva';

const GUIDELINE_OFFSET = 5;

class KonvaSnappingDemo {
    private stage: Konva.Stage;
    private layer: Konva.Layer;

    constructor(stage: Konva.Stage, layer: Konva.Layer) {
        this.stage = stage;
        this.layer = layer;
        this.setupDragEvents();
    }

    private getLineGuideStops(skipShape: Konva.Node): {
        vertical: number[];
        horizontal: number[];
    } {
        const vertical = [0, this.stage.width() / 2, this.stage.width()];
        const horizontal = [0, this.stage.height() / 2, this.stage.height()];

        this.stage.find('.object').forEach((guideItem) => {
            if (guideItem === skipShape) {
                return;
            }
            const box = guideItem.getClientRect();
            vertical.push(box.x, box.x + box.width, box.x + box.width / 2);
            horizontal.push(box.y, box.y + box.height, box.y + box.height / 2);
        });

        return {
            vertical: vertical.flat(),
            horizontal: horizontal.flat(),
        };
    }

    private getObjectSnappingEdges(node: Konva.Node): {
        vertical: any[];
        horizontal: any[];
    } {
        const box = node.getClientRect();
        const absPos = node.absolutePosition();

        return {
            vertical: [
                {
                    guide: Math.round(box.x),
                    offset: Math.round(absPos.x - box.x),
                    snap: 'start',
                },
                {
                    guide: Math.round(box.x + box.width / 2),
                    offset: Math.round(absPos.x - box.x - box.width / 2),
                    snap: 'center',
                },
                {
                    guide: Math.round(box.x + box.width),
                    offset: Math.round(absPos.x - box.x - box.width),
                    snap: 'end',
                },
            ],
            horizontal: [
                {
                    guide: Math.round(box.y),
                    offset: Math.round(absPos.y - box.y),
                    snap: 'start',
                },
                {
                    guide: Math.round(box.y + box.height / 2),
                    offset: Math.round(absPos.y - box.y - box.height / 2),
                    snap: 'center',
                },
                {
                    guide: Math.round(box.y + box.height),
                    offset: Math.round(absPos.y - box.y - box.height),
                    snap: 'end',
                },
            ],
        };
    }

    private getGuides(
        lineGuideStops: { vertical: number[]; horizontal: number[] },
        itemBounds: { vertical: any[]; horizontal: any[] },
    ): any[] {
        const resultV: any[] = [];
        const resultH: any[] = [];

        lineGuideStops.vertical.forEach((lineGuide) => {
            itemBounds.vertical.forEach((itemBound) => {
                const diff = Math.abs(lineGuide - itemBound.guide);
                if (diff < GUIDELINE_OFFSET) {
                    resultV.push({
                        lineGuide: lineGuide,
                        diff: diff,
                        snap: itemBound.snap,
                        offset: itemBound.offset,
                    });
                }
            });
        });

        lineGuideStops.horizontal.forEach((lineGuide) => {
            itemBounds.horizontal.forEach((itemBound) => {
                const diff = Math.abs(lineGuide - itemBound.guide);
                if (diff < GUIDELINE_OFFSET) {
                    resultH.push({
                        lineGuide: lineGuide,
                        diff: diff,
                        snap: itemBound.snap,
                        offset: itemBound.offset,
                    });
                }
            });
        });

        const guides: any[] = [];

        const minV = resultV.sort((a, b) => a.diff - b.diff)[0];
        const minH = resultH.sort((a, b) => a.diff - b.diff)[0];
        if (minV) {
            guides.push({
                lineGuide: minV.lineGuide,
                offset: minV.offset,
                orientation: 'V',
                snap: minV.snap,
            });
        }
        if (minH) {
            guides.push({
                lineGuide: minH.lineGuide,
                offset: minH.offset,
                orientation: 'H',
                snap: minH.snap,
            });
        }
        return guides;
    }

    private drawGuides(guides: any[]): void {
        guides.forEach((lg) => {
            if (lg.orientation === 'H') {
                const line = new Konva.Line({
                    points: [-6000, 0, 6000, 0],
                    stroke: 'rgb(0, 161, 255)',
                    strokeWidth: 1,
                    name: 'guid-line',
                    dash: [4, 6],
                });
                this.layer.add(line);
                line.absolutePosition({
                    x: 0,
                    y: lg.lineGuide,
                });
            } else if (lg.orientation === 'V') {
                const line = new Konva.Line({
                    points: [0, -6000, 0, 6000],
                    stroke: 'rgb(0, 161, 255)',
                    strokeWidth: 1,
                    name: 'guid-line',
                    dash: [4, 6],
                });
                this.layer.add(line);
                line.absolutePosition({
                    x: lg.lineGuide,
                    y: 0,
                });
            }
        });
    }

    private setupDragEvents(): void {
        this.layer.on('dragmove', (e) => {
            this.layer.find('.guid-line').forEach((l) => l.destroy());

            const lineGuideStops = this.getLineGuideStops(e.target);
            const itemBounds = this.getObjectSnappingEdges(e.target);

            const guides = this.getGuides(lineGuideStops, itemBounds);

            if (!guides.length) {
                return;
            }

            this.drawGuides(guides);

            const absPos = e.target.absolutePosition();

            guides.forEach((lg) => {
                switch (lg.snap) {
                    case 'start':
                    case 'center':
                    case 'end':
                        if (lg.orientation === 'V') {
                            absPos.x = lg.lineGuide + lg.offset;
                        } else if (lg.orientation === 'H') {
                            absPos.y = lg.lineGuide + lg.offset;
                        }
                        break;
                }
            });
            e.target.absolutePosition(absPos);
        });

        this.layer.on('dragend', () => {
            this.layer.find('.guid-line').forEach((l) => l.destroy());
        });
    }
}

export default KonvaSnappingDemo;
