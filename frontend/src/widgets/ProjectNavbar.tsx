import { updatePicture, useProjectStore } from '@/entities/project';
import { Label } from '@/shared/ui/label';
import {
    CircleIcon,
    DotsHorizontalIcon,
    DownloadIcon,
    FontBoldIcon,
    HomeIcon,
    SlashIcon,
    TextIcon,
} from '@radix-ui/react-icons';
import {
    BoxIcon,
    CursorArrowIcon,
    EraserIcon,
    GroupIcon,
    ImageIcon,
    Pencil1Icon,
} from '@radix-ui/react-icons';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/shared/ui/select';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';

import WebFont from 'webfontloader';

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Img } from 'react-image';
import {
    BrushIcon,
    ItalicIcon,
    PencilLineIcon,
    SaveIcon,
    SprayCanIcon,
} from 'lucide-react';
import Konva from 'konva';
import { useUserStore } from '@/entities/user';
import { useNavigate } from 'react-router-dom';
export const ProjectNavbar = () => {
    const navigate = useNavigate();
    const state = useProjectStore((state) => state.state);
    const stage = useProjectStore((state) => state.stage);
    const drawState = useProjectStore((state) => state.drawState);
    const setDrawState = useProjectStore((state) => state.setDrawState);
    const brushSettings = useProjectStore((state) => state.brushSettings);
    const setBrushSettings = useProjectStore((state) => state.setBrushSettings);
    const shapeSettings = useProjectStore((state) => state.shapeSettings);
    const setShapeSettings = useProjectStore((state) => state.setShapeSettings);
    const textSettings = useProjectStore((state) => state.textSettings);
    const setTextSettings = useProjectStore((state) => state.setTextSettings);
    const saveProject = useProjectStore((state) => state.saveProject);
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(false);
    const [underline, setUnderline] = useState(false);
    const [loadedFonts, setLoadedFonts] = useState<string[]>([]);

    const backgroundInputRef = useRef<HTMLInputElement | null>(null);
    const [bgColor, setBgColor] = useState('');
    const setBackground = useProjectStore(
        (state) => state.setSelectedBackgroundImage,
    );

    const showBackgroundColor = useProjectStore(
        (state) => state.showBackgroundColorFill,
    );
    const setShowBackgroundColor = useProjectStore(
        (state) => state.setShowBackgroundColorFill,
    );
    const isLogin = useUserStore((state) => state.isLogin);

    const handleBackgroundClick = () => {
        backgroundInputRef.current?.click();
    };

    const handleBackgroundChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (ev) => {
            if (isLogin) {
                const src = await updatePicture(file);
                setBackground(src);
            } else {
                const data = ev.target?.result;
                if (typeof data !== 'string') return;
                setBackground(data);
            }
        };
        reader.readAsDataURL(file);
    };

    const handleColorBackgroundChange = (e: ChangeEvent<HTMLInputElement>) => {
        const color = e.target.value;
        if (!stage) return;
        const rect = new Konva.Rect({
            fill: color,
            height: stage?.height(),
            width: stage?.width(),
        });
        rect.toDataURL({
            x: 0,
            y: 0,
            callback: (str) => {
                setBackground(str);
                // setUpdatePreview();
                rect.destroy();
            },
        });
    };

    const handleBgChange = (e: ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        if (bgColor && bgColor.length !== 0) {
            setShowBackgroundColor(isChecked);
        }

        // if (isChecked) {
        //     if (bgColor !== '') {
        //         handleColorBackgroundChange({
        //             target: { value: bgColor },
        //         } as React.ChangeEvent<HTMLInputElement>);
        //     }
        // } else {
        //     setBgColor('');
        // }
    };

    const setFontFamily = (value: string) => {
        setTextSettings({ fontFamily: value });
    };
    const setTextAlign = (value: string) => {
        setTextSettings({ align: value });
    };

    const handleFillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked ? '#000000' : '';
        setShapeSettings({ fill: value });
    };

    const handleStrokeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked ? '#000000' : '';
        setShapeSettings({ stroke: value });
    };

    const handleFillChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked ? '#000000' : '';
        setTextSettings({ fill: value });
    };

    const handleStrokeChangeText = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.checked ? '#000000' : '';
        setTextSettings({ stroke: value });
    };

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
        setTextSettings({
            fontStyle: `${bold ? 'bold' : ''} ${italic ? 'italic' : ''}`,
        });
    }, [bold, italic]);

    useEffect(() => {
        setTextSettings({
            textDecoration: underline ? 'underline' : 'none',
        });
    }, [underline]);

    useEffect(() => {
        if (drawState === 'Line' || drawState === 'AnchorLine') {
            setShapeSettings({ stroke: '#000000' });
        }
        if (drawState === 'Drawing') {
            setBrushSettings({ color: '#000000' });
        }
    }, [drawState]);

    const downloadURI = (uri: string, name: string) => {
        const link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownload = () => {
        if (stage) {
            const stagetemp = stage.clone();
            stagetemp.to({
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                width: stage.width() / stage.scaleX(),
                height: stage.height() / stage.scaleY(),
                transformerEnabled: false,
                onFinish: () => {
                    const dataURL = stagetemp.toDataURL({ pixelRatio: 1 });
                    downloadURI(dataURL, 'stage.png');
                },
            });
            stagetemp.remove();
        }
    };

    const renderIcon = () => {
        switch (state) {
            case 'Drag':
                return (
                    <CursorArrowIcon className="h-8 w-8 cursor-pointer text-foreground" />
                );
            case 'SelectionArea':
                return (
                    <GroupIcon className="h-8 w-8 cursor-pointer text-foreground" />
                );
            case 'CreateFigure':
                return (
                    <>
                        <div className="ml-10 flex gap-2">
                            <BoxIcon
                                className={`h-8 w-8 cursor-pointer rounded-md p-[2px] text-foreground ${
                                    drawState === 'Rect' ? 'bg-secondary' : ''
                                }`}
                                onClick={() => setDrawState('Rect')}
                            />
                            <CircleIcon
                                className={`h-8 w-8 cursor-pointer rounded-md p-[2px] text-foreground ${
                                    drawState === 'Circle' ? 'bg-secondary' : ''
                                }`}
                                onClick={() => setDrawState('Circle')}
                            />
                            <SlashIcon
                                className={`h-8 w-8 cursor-pointer rounded-md p-[2px] text-foreground ${
                                    drawState === 'Line' ? 'bg-secondary' : ''
                                }`}
                                onClick={() => setDrawState('Line')}
                            />
                            <Img
                                src="../src/public/curve.svg"
                                className={`h-8 w-8 cursor-pointer rounded-md p-[2px] text-foreground ${
                                    drawState === 'AnchorLine'
                                        ? 'bg-secondary'
                                        : ''
                                }`}
                                onClick={() => setDrawState('AnchorLine')}
                            />
                        </div>
                        <div
                            className={`ml-10 flex ${
                                drawState === 'Line' ||
                                drawState === 'AnchorLine'
                                    ? 'hidden'
                                    : 'flex'
                            }`}
                        >
                            <div className="col-span-1 flex w-full items-center justify-center p-2">
                                <input
                                    type="checkbox"
                                    checked={shapeSettings.fill !== ''}
                                    onChange={handleFillChange}
                                />
                                <Label className="pl-1">Fill</Label>
                            </div>
                            <div className="col-span-1 flex w-full justify-center gap-2">
                                <input
                                    type="color"
                                    value={shapeSettings.fill}
                                    onChange={(e) => {
                                        setShapeSettings({
                                            fill: e.target.value,
                                        });
                                    }}
                                    disabled={shapeSettings.fill === ''}
                                    className="w-10 bg-background p-1"
                                />
                            </div>
                        </div>
                        <div className="ml-5 flex">
                            <div className="col-span-1 flex w-full items-center justify-center p-2">
                                <input
                                    type="checkbox"
                                    checked={shapeSettings.stroke !== ''}
                                    onChange={handleStrokeChange}
                                    className={`${
                                        drawState === 'Line' ||
                                        drawState === 'AnchorLine'
                                            ? 'hidden'
                                            : ''
                                    }`}
                                />
                                <Label className="pl-1">Stroke</Label>
                            </div>
                            <div className="col-span-1 flex w-full justify-center gap-2">
                                <input
                                    type="color"
                                    value={shapeSettings.stroke}
                                    onChange={(e) => {
                                        setShapeSettings({
                                            stroke: e.target.value,
                                        });
                                    }}
                                    disabled={shapeSettings.stroke === ''}
                                    className="w-10 bg-background p-1"
                                />
                            </div>
                            <div className="col-span-1 flex w-full justify-center gap-2">
                                <Label className="pl-1">Stroke width</Label>
                                <input
                                    type="number"
                                    value={shapeSettings.strokeWidth}
                                    onChange={(e) => {
                                        setShapeSettings({
                                            strokeWidth: parseInt(
                                                e.target.value,
                                            ),
                                        });
                                    }}
                                    className="w-16 bg-background p-1"
                                />
                            </div>
                            <div className="col-span-1 flex w-full items-center justify-center gap-2">
                                <Label className="pl-1">Opacity</Label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={shapeSettings.opacity}
                                    onChange={(e) => {
                                        // console.log(e.target.value);
                                        setShapeSettings({
                                            opacity: parseFloat(e.target.value),
                                        });
                                    }}
                                    className="w-16 bg-background p-1"
                                />
                            </div>
                        </div>
                    </>
                );
            case 'Drawing':
                return (
                    <>
                        {/* <Pencil1Icon className="h-6 w-6 cursor-pointer text-foreground" /> */}
                        <div className="ml-10 flex gap-2">
                            <Pencil1Icon
                                className={`h-8 w-8 cursor-pointer rounded-md p-[2px] text-foreground ${
                                    drawState === 'Pencil' ? 'bg-secondary' : ''
                                }`}
                                onClick={() => setDrawState('Pencil')}
                            />
                            <PencilLineIcon
                                className={`h-8 w-8 cursor-pointer rounded-md p-[2px] text-foreground ${
                                    drawState === 'Marker' ? 'bg-secondary' : ''
                                }`}
                                onClick={() => setDrawState('Marker')}
                            />
                            <BrushIcon
                                className={`h-8 w-8 cursor-pointer rounded-md p-[2px] text-foreground ${
                                    drawState === 'Inc' ? 'bg-secondary' : ''
                                }`}
                                onClick={() => setDrawState('Inc')}
                            />
                            <SprayCanIcon
                                className={`h-8 w-8 cursor-pointer rounded-md p-[2px] text-foreground ${
                                    drawState === 'Spray' ? 'bg-secondary' : ''
                                }`}
                                onClick={() => setDrawState('Spray')}
                            />
                        </div>
                        <div className="ml-5 flex">
                            <div className="col-span-1 flex w-full items-center justify-center p-2">
                                <Label className="pl-1">Stroke</Label>
                            </div>
                            <div className="col-span-1 flex w-full justify-center gap-2">
                                <input
                                    type="color"
                                    value={brushSettings.color}
                                    onChange={(e) =>
                                        setBrushSettings({
                                            color: e.target.value,
                                        })
                                    }
                                    disabled={brushSettings.color === ''}
                                    className="w-10 bg-background p-1"
                                />
                            </div>
                            <div className="col-span-1 flex w-full justify-center gap-2">
                                <Label className="pl-1">Stroke width</Label>
                                <input
                                    type="number"
                                    value={brushSettings.width}
                                    onChange={(e) => {
                                        setBrushSettings({
                                            width: parseInt(e.target.value),
                                        });
                                    }}
                                    className="w-16 bg-background p-1"
                                />
                            </div>
                            <div className="col-span-1 flex w-full items-center justify-center gap-2">
                                <Label className="pl-1">Opacity</Label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={brushSettings.opacity}
                                    onChange={(e) => {
                                        // console.log(e.target.value);
                                        setBrushSettings({
                                            opacity: parseFloat(e.target.value),
                                        });
                                    }}
                                    className="w-16 bg-background p-1"
                                />
                            </div>
                        </div>
                    </>
                );
            case 'Erasing':
                return (
                    <>
                        <EraserIcon className="h-6 w-6 cursor-pointer text-foreground" />
                        <div className="ml-5 flex">
                            <div className="col-span-1 flex items-center justify-center">
                                <Label className="pl-1">Stroke width</Label>
                            </div>
                            <div className="col-span-1 flex justify-center gap-2">
                                <input
                                    type="number"
                                    value={brushSettings.width}
                                    onChange={(e) => {
                                        setBrushSettings({
                                            width: parseInt(e.target.value),
                                        });
                                    }}
                                    className="w-16 bg-background p-1"
                                />
                            </div>
                        </div>
                    </>
                );
            case 'Image':
                return (
                    <ImageIcon className="h-6 w-6 cursor-pointer text-foreground" />
                );
            case 'Text':
                return (
                    <>
                        <TextIcon className="h-6 w-6 cursor-pointer text-foreground" />
                        <div className="ml-10 flex w-full items-center">
                            <div className="flex items-center">
                                <Label>Font size</Label>
                                <input
                                    type="number"
                                    value={textSettings.fontSize}
                                    onChange={(e) => {
                                        setTextSettings({
                                            fontSize: parseInt(e.target.value),
                                        });
                                    }}
                                    className="w-16 bg-background p-1"
                                />
                            </div>
                            {load ? (
                                <Select onValueChange={setFontFamily}>
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="Font Family" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {loadedFonts.map((font) => (
                                            <SelectItem key={font} value={font}>
                                                {font}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                'Loading fonts...'
                            )}
                            <div className="col-span-1 flex items-center justify-center p-2">
                                <input
                                    type="checkbox"
                                    checked={textSettings.fill !== ''}
                                    onChange={handleFillChangeText}
                                />
                                <Label className="pl-1">Fill</Label>
                            </div>
                            <div className="col-span-1 flex justify-center gap-2">
                                <input
                                    type="color"
                                    value={textSettings.fill}
                                    onChange={(e) => {
                                        setTextSettings({
                                            fill: e.target.value,
                                        });
                                    }}
                                    disabled={textSettings.fill === ''}
                                    className="w-10 bg-background p-1"
                                />
                            </div>
                            <div className="col-span-1 flex items-center justify-center p-2">
                                <input
                                    type="checkbox"
                                    checked={textSettings.stroke !== ''}
                                    onChange={handleStrokeChangeText}
                                />
                                <Label className="pl-1">Stroke</Label>
                            </div>
                            <div className="col-span-1 flex justify-center gap-2">
                                <input
                                    type="color"
                                    value={textSettings.stroke}
                                    onChange={(e) => {
                                        setTextSettings({
                                            stroke: e.target.value,
                                        });
                                    }}
                                    disabled={textSettings.stroke === ''}
                                    className="w-10 bg-background p-1"
                                />
                            </div>
                            <div className="flex items-center pl-5">
                                <Label>padding</Label>
                                <input
                                    type="number"
                                    value={textSettings.padding}
                                    onChange={(e) => {
                                        setTextSettings({
                                            padding: parseInt(e.target.value),
                                        });
                                    }}
                                    className="w-16 bg-background p-1"
                                />
                            </div>
                            <div className="flex items-center pl-5">
                                <Select onValueChange={setTextAlign}>
                                    <SelectTrigger className="w-[100px]">
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
                            <div className="col-span-1 flex w-full items-center justify-center gap-2">
                                <Label className="pl-1">Opacity</Label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={textSettings.opacity}
                                    onChange={(e) => {
                                        // console.log(e.target.value);
                                        setTextSettings({
                                            opacity: parseFloat(e.target.value),
                                        });
                                    }}
                                    className="w-16 bg-background p-1"
                                />
                            </div>
                        </div>
                    </>
                );
            case 'SelectBackground':
                return (
                    <>
                        <div className="ml-5 flex">
                            <div
                                className="flex h-10 w-full items-center justify-center"
                                onClick={handleBackgroundClick}
                            >
                                <ImageIcon className="h-6 w-6 cursor-pointer text-foreground" />
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleBackgroundChange}
                                    className="hidden"
                                    ref={backgroundInputRef}
                                />
                            </div>
                            <div className="col-span-1 flex w-full items-center justify-center gap-3 p-2">
                                <Label className="pl-1">
                                    Background color{' '}
                                </Label>
                                <input
                                    type="checkbox"
                                    checked={showBackgroundColor}
                                    onChange={handleBgChange}
                                />
                            </div>
                            <div className="col-span-1 flex w-full items-center justify-center gap-2">
                                <input
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => {
                                        setBgColor(e.target.value);
                                        handleColorBackgroundChange(e);
                                    }}
                                    className="w-10 bg-background p-1"
                                />
                            </div>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };
    return (
        <div className="fixed top-[70px] z-20 h-[50px] w-full pr-[300px]">
            <div className="flex h-full w-full flex-row  items-center justify-center">
                <div className="flex min-w-[500px] rounded-lg border bg-background p-2 shadow-md">
                    <div className="flex h-full items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <DotsHorizontalIcon className="h-8 w-8 cursor-pointer text-foreground" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>settings</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => {
                                        navigate('/home');
                                        saveProject();
                                    }}
                                >
                                    <HomeIcon className="h-6 w-6 cursor-pointer text-foreground" />
                                    <p className="pl-2">home</p>
                                </DropdownMenuItem>
                                {isLogin && (
                                    <DropdownMenuItem
                                        onClick={() => saveProject()}
                                    >
                                        <SaveIcon className="h-6 w-6 cursor-pointer text-foreground" />
                                        <p className="pl-2">save</p>
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={handleDownload}>
                                    <DownloadIcon className="h-6 w-6 cursor-pointer text-foreground" />
                                    <p className="pl-2">download</p>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="ml-4 flex h-full w-full items-center">
                        {renderIcon()}
                    </div>
                </div>
            </div>
        </div>
    );
};
