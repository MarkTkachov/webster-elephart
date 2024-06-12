import Konva from 'konva';

export const clearAllSelection = (stage?: Konva.Stage | null) => {
    if (!stage) return;
    const transformers = stage.find('Transformer');
    // console.log(transformers);

    transformers.forEach((tr) => {
        // console.log(tr.getType());

        if (tr.getType() === 'Group') (tr as Konva.Transformer).nodes([]);
    });
};
