import { useProjectStore } from '@/entities/project';
import { ColorCorrection } from '@/entities/project/ui/ColorCorrection';
import { Label } from '@/shared/ui/label';
import Konva from 'konva';
import { useEffect, useState } from 'react';
import WebFont from 'webfontloader';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select';
import { FontBoldIcon, TextIcon } from '@radix-ui/react-icons';
import { ItalicIcon } from 'lucide-react';
const Preview = () => {
    const selectedLayer = useProjectStore((state) => state.selectedLayer);
    const UpdatePreview = useProjectStore((state) => state.updatePreview);
    const [src, setSrc] = useState<any>(null);
    const SelectedShape = useProjectStore((state) => state.selectedShape);
    const setUpdatePreview = useProjectStore((state) => state.setUpdatePreview);
    const [loadedFonts, setLoadedFonts] = useState<string[]>([]);
    const fonts = ['Roboto', 'Open Sans', 'Arial', 'Lobster', 'Montserrat'];
    const [load, setLoad] = useState(false);

    useEffect(() => {
        WebFont.load({
            google: {
                families: fonts,
            },
            active: () => {
                setLoadedFonts(fonts);
                setLoad(true);
            },
        });
    }, []);

    useEffect(() => {
        console.log(UpdatePreview);
    }, [UpdatePreview]);

    const [fill, setFill] = useState<string>(
        (SelectedShape as Konva.Shape)?.fill() || '',
    );
    const [stroke, setStroke] = useState<string>(
        (SelectedShape as Konva.Shape)?.stroke() || '',
    );

    useEffect(() => {
        setFill((SelectedShape as Konva.Shape)?.fill() || '');
        setStroke((SelectedShape as Konva.Shape)?.stroke() || '');
        console.log(SelectedShape);
    }, [SelectedShape]);

    const handleFillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked ? '#000000' : '';
        setFill(value);
        (SelectedShape as Konva.Shape).fill(value);
    };

    const handleStrokeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked ? '#000000' : '';
        setStroke(value);
        (SelectedShape as Konva.Shape).stroke(value);
        setUpdatePreview();
    };

    const handleFillColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFill(e.target.value);
        (SelectedShape as Konva.Shape).fill(e.target.value);
        setUpdatePreview();
    };

    const handleStrokeColorChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setStroke(e.target.value);
        (SelectedShape as Konva.Shape).stroke(e.target.value);
    };

    useEffect(() => {
        if (!selectedLayer) return;
        const scale = 1 / 2;
        setSrc(selectedLayer.toDataURL({ pixelRatio: scale }));
    }, [selectedLayer, UpdatePreview]);

    const handleEditX = (SelectedShape: Konva.Shape | null, e: any) => {
        if (SelectedShape) {
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
                SelectedShape.x(value);
            }
        }
    };

    const handleEditY = (SelectedShape: Konva.Shape | null, e: any) => {
        if (SelectedShape) {
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
                SelectedShape.y(value);
            }
        }
    };

    const handleEditWidth = (SelectedShape: Konva.Shape | null, e: any) => {
        if (SelectedShape) {
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
                SelectedShape.scaleX(value);
            }
        }
    };

    const handleEditHeight = (SelectedShape: Konva.Shape | null, e: any) => {
        if (SelectedShape) {
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
                SelectedShape.scaleY(value);
            }
        }
    };

    const formatNumber = (num: number) => {
        return num ? num.toFixed(2) : 'N/A';
    };

    const setFontFamily = (value: string) => {
        (SelectedShape as Konva.Text).fontFamily(value);
        setUpdatePreview();
    };

    const setTextAlign = (value: string) => {
        (SelectedShape as Konva.Text).align(value);
        setUpdatePreview();
    };

    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [underline, setUnderline] = useState(false);

    useEffect(() => {
        if (SelectedShape && SelectedShape instanceof Konva.Text) {
            const fontStyle = `${bold ? 'bold' : ''} ${
                italic ? 'italic' : ''
            }`.trim();
            SelectedShape.fontStyle(fontStyle);
            SelectedShape.getLayer()?.batchDraw(); // Redraw the layer to apply changes
        }
    }, [bold, italic, SelectedShape]);

    useEffect(() => {
        if (SelectedShape && SelectedShape instanceof Konva.Text) {
            const textDecoration = underline ? 'underline' : 'none';
            SelectedShape.textDecoration(textDecoration);
            SelectedShape.getLayer()?.batchDraw(); // Redraw the layer to apply changes
        }
    }, [underline, SelectedShape]);

    return (
        <div className="h-full pt-[1px]">
            {SelectedShape ? (
                <>
                    <div
                        className="flex max-h-[200px] w-full flex-col items-center justify-center border-canva bg-center"
                        style={{
                            backgroundImage:
                                "url('/src/public/bg-project.png')",
                        }}
                    >
                        <img
                            src={SelectedShape.toDataURL({})}
                            alt="preview"
                            className="h-full w-full object-contain"
                            style={{
                                aspectRatio: `${
                                    SelectedShape.width() /
                                    SelectedShape.height()
                                }`,
                            }}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-sm">
                        <div className="col-span-1 flex w-full justify-center gap-2">
                            <p className="font-bold text-muted-foreground">x</p>
                            <input
                                key={`x-${SelectedShape?.x()}`}
                                defaultValue={formatNumber(SelectedShape.x())}
                                onChange={(e) =>
                                    handleEditX(SelectedShape as Konva.Shape, e)
                                }
                                className="w-12"
                            />
                        </div>
                        <div className="col-span-1 flex w-full justify-center gap-2">
                            <p className="font-bold text-muted-foreground">
                                scaleX
                            </p>
                            <input
                                key={`scaleX-${SelectedShape?.scaleX()}`}
                                defaultValue={formatNumber(
                                    SelectedShape.scaleX(),
                                )}
                                onChange={(e) =>
                                    handleEditWidth(
                                        SelectedShape as Konva.Shape,
                                        e,
                                    )
                                }
                                className="w-12"
                            />
                        </div>
                        <div className="col-span-1 flex w-full justify-center gap-2">
                            <p className="font-bold text-muted-foreground">y</p>
                            <input
                                key={`y-${SelectedShape?.y()}`}
                                defaultValue={formatNumber(SelectedShape.y())}
                                onChange={(e) =>
                                    handleEditY(SelectedShape as Konva.Shape, e)
                                }
                                className="w-12"
                            />
                        </div>
                        <div className="col-span-1 flex w-full justify-center gap-2">
                            <p className="font-bold text-muted-foreground">
                                scaleY
                            </p>
                            <input
                                key={`scaleY-${SelectedShape?.scaleY()}`}
                                defaultValue={formatNumber(
                                    SelectedShape.scaleY(),
                                )}
                                onChange={(e) =>
                                    handleEditHeight(
                                        SelectedShape as Konva.Shape,
                                        e,
                                    )
                                }
                                className="w-12"
                            />
                        </div>

                        {SelectedShape.getClassName() === 'Image' ? (
                            <div className="col-span-2 flex w-full justify-center">
                                <ColorCorrection
                                    SelectedShape={SelectedShape}
                                />
                            </div>
                        ) : (
                            <>
                                <div className="col-span-1 flex w-full items-center justify-center p-2">
                                    <input
                                        type="checkbox"
                                        checked={fill !== ''}
                                        onChange={handleFillChange}
                                    />
                                    <Label className="pl-1">Fill</Label>
                                </div>
                                <div className="col-span-1 flex w-full items-center justify-center p-2">
                                    <input
                                        type="checkbox"
                                        checked={stroke !== ''}
                                        onChange={handleStrokeChange}
                                    />
                                    <Label className="pl-1">Stroke</Label>
                                </div>
                                <div className="col-span-1 flex w-full justify-center gap-2">
                                    <input
                                        type="color"
                                        value={fill !== '' ? fill : '#000000'}
                                        onChange={handleFillColorChange}
                                        disabled={fill === ''}
                                        className="w-16"
                                    />
                                </div>
                                <div className="col-span-1 flex w-full justify-center gap-2">
                                    <input
                                        type="color"
                                        value={
                                            stroke !== '' ? stroke : '#000000'
                                        }
                                        onChange={handleStrokeColorChange}
                                        disabled={stroke === ''}
                                        className="w-16"
                                    />
                                </div>
                            </>
                        )}
                        {SelectedShape.getClassName() === 'Text' && (
                            <div className="col-span-2 grid w-full grid-cols-3 justify-center gap-2 px-2">
                                <Label className="col-span-1 flex items-center pl-1 font-bold text-muted-foreground">
                                    Font family
                                </Label>
                                <div className="col-span-2">
                                    {load ? (
                                        <Select onValueChange={setFontFamily}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Font Family" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {loadedFonts.map((font) => (
                                                    <SelectItem
                                                        key={font}
                                                        value={font}
                                                    >
                                                        {font}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        'Loading fonts...'
                                    )}
                                </div>
                                <Label className="col-span-1 flex items-center pl-1 font-bold text-muted-foreground">
                                    Font size
                                </Label>
                                <input
                                    type="number"
                                    className="col-span-2 rounded-md border-2 p-1"
                                    defaultValue={(
                                        SelectedShape as Konva.Text
                                    ).fontSize()}
                                    onChange={(e) => {
                                        (SelectedShape as Konva.Text).fontSize(
                                            parseFloat(e.target.value),
                                        );
                                        setUpdatePreview();
                                    }}
                                />
                                <Label className="col-span-1 flex items-center pl-1 font-bold text-muted-foreground">
                                    Padding
                                </Label>
                                <input
                                    type="number"
                                    className="col-span-2 rounded-md border-2 p-1"
                                    defaultValue={(
                                        SelectedShape as Konva.Text
                                    ).padding()}
                                    onChange={(e) => {
                                        (SelectedShape as Konva.Text).padding(
                                            parseFloat(e.target.value),
                                        );
                                        setUpdatePreview();
                                    }}
                                />
                                <Label className="col-span-1 flex items-center pl-1 font-bold text-muted-foreground">
                                    Allign
                                </Label>
                                <div className="col-span-2">
                                    <div className="flex items-center">
                                        <Select onValueChange={setTextAlign}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Align" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="left">
                                                    Left
                                                </SelectItem>
                                                <SelectItem value="center">
                                                    Center
                                                </SelectItem>
                                                <SelectItem value="right">
                                                    Right
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="col-span-3 flex items-center justify-center">
                                    <div className="flex items-center pl-5">
                                        <FontBoldIcon
                                            className="h-6 w-6 cursor-pointer text-foreground"
                                            onClick={() => {
                                                setBold(!bold);
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center pl-5">
                                        <ItalicIcon
                                            className="h-6 w-6 cursor-pointer text-foreground"
                                            onClick={() => {
                                                setItalic(!italic);
                                            }}
                                        />
                                    </div>
                                    <div className="flex items-center pl-5">
                                        <TextIcon
                                            className="h-6 w-6 cursor-pointer text-foreground"
                                            onClick={() => {
                                                setUnderline(!underline);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <img
                    src={src}
                    alt="preview"
                    className=" bg-center"
                    style={{
                        backgroundImage: "url('/src/public/bg-project.png')",
                    }}
                />
            )}
        </div>
    );
};

export default Preview;
