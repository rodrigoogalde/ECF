"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Plus, Trash2, CloudUpload, Loader2, X, Heart, ChevronDown } from "lucide-react";
import { Prisma } from "@prisma/client";
import { questionSchema } from "@/lib/validations/question";
import { createQuestion, updateQuestion } from "@/app/actions/routes/question";
import { createOption, updateOption, deleteOption, getOptionsByQuestionCode } from "@/app/actions/routes/option";
import { getAllCourses } from "@/app/actions/routes/course";
import { ROUTES } from "@/lib/config/routes";

interface OptionForm {
  id?: number;
  tempId?: string;
  label: string;
  text: string;
  imageUrl: string[];
  isNew?: boolean;
}

interface QuestionFormProps {
  question?: Prisma.QuestionGetPayload<{
    include: {
      options: true;
      course: true;
    };
  }>;
}

export function QuestionForm({ question }: QuestionFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<{ code: string; topic: string }[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const isEditing = !!question;

  const [formData, setFormData] = useState({
    uniqueCode: question?.uniqueCode || "",
    title: question?.title || "",
    content: question?.content || "",
    period: question?.period || "",
    type: question?.type || "",
    solution: question?.solution || "",
    imageUrl: question?.imageUrl || ([] as string[]),
    correctLabel: question?.correctLabel || "",
    courseCode: question?.courseCode || "",
  });

  const [options, setOptions] = useState<OptionForm[]>(
    question?.options?.map((opt) => ({
      id: opt.id,
      label: opt.label,
      text: opt.text,
      imageUrl: opt.imageUrl || [],
      isNew: false,
    })) || [
      { tempId: crypto.randomUUID(), label: "A", text: "", imageUrl: [], isNew: true },
      { tempId: crypto.randomUUID(), label: "B", text: "", imageUrl: [], isNew: true },
      { tempId: crypto.randomUUID(), label: "C", text: "", imageUrl: [], isNew: true },
      { tempId: crypto.randomUUID(), label: "D", text: "", imageUrl: [], isNew: true },
    ]
  );

  const [deletedOptionIds, setDeletedOptionIds] = useState<number[]>([]);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [optionImageUrls, setOptionImageUrls] = useState<{ [key: string]: string }>({});
  const [uploadedImages, setUploadedImages] = useState<string[]>(question?.imageUrl || []);
  const [mainImage, setMainImage] = useState<string>(question?.imageUrl?.[0] || "");
  const [uploadingImages, setUploadingImages] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<{ images?: string | string[]; image?: string }>({});
  const [openSections, setOpenSections] = useState({ images: true });

  useEffect(() => {
    getAllCourses().then((data) => {
      setCourses(data);
      setLoadingCourses(false);
    });
  }, []);

  useEffect(() => {
    setFormData(prev => ({ ...prev, imageUrl: uploadedImages }));
  }, [uploadedImages]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setErrors({});

    const newErrors: string[] = [];
    const validFiles: File[] = [];

    Array.from(files).forEach((file) => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        newErrors.push(`${file.name}: Formato no permitido`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        newErrors.push(`${file.name}: Tamaño máximo 5MB`);
        return;
      }
      validFiles.push(file);
    });

    if (newErrors.length > 0) {
      setErrors({ images: newErrors });
    }

    if (validFiles.length > 0) {
      try {
        const uploadPromises = validFiles.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Error al subir ${file.name}`);
          }

          const data = await response.json();
          return data.url;
        });

        const urls = await Promise.all(uploadPromises);
        const newImages = [...uploadedImages, ...urls];
        setUploadedImages(newImages);
        
        if (!mainImage && urls.length > 0) {
          setMainImage(urls[0]);
        }

        toast.success(`${urls.length} imagen(es) subida(s) exitosamente`);
      } catch (error) {
        console.error('Error uploading images:', error);
        toast.error('Error al subir las imágenes');
      }
    }

    setUploadingImages(false);
  };

  const handleImageDelete = (url: string) => {
    const newImages = uploadedImages.filter(img => img !== url);
    setUploadedImages(newImages);
    
    if (mainImage === url) {
      setMainImage(newImages[0] || "");
    }
  };

  const handleSetMainImage = (url: string) => {
    setMainImage(url);
    const reorderedImages = [url, ...uploadedImages.filter(img => img !== url)];
    setUploadedImages(reorderedImages);
  };

  const handleAddOption = () => {
    const nextLabel = String.fromCharCode(65 + options.length);
    setOptions([
      ...options,
      {
        tempId: crypto.randomUUID(),
        label: nextLabel,
        text: "",
        imageUrl: [],
        isNew: true,
      },
    ]);
  };

  const handleRemoveOption = (option: OptionForm) => {
    if (options.length <= 1) return;
    
    if (option.id && !option.isNew) {
      setDeletedOptionIds([...deletedOptionIds, option.id]);
    }
    setOptions(options.filter((opt) => 
      opt.id ? opt.id !== option.id : opt.tempId !== option.tempId
    ));
  };

  const handleOptionChange = (option: OptionForm, field: keyof OptionForm, value: string) => {
    setOptions(
      options.map((opt) =>
        (opt.id && opt.id === option.id) || (opt.tempId && opt.tempId === option.tempId)
          ? { ...opt, [field]: value }
          : opt
      )
    );
  };

  const handleAddQuestionImage = () => {
    if (currentImageUrl.trim()) {
      setFormData({
        ...formData,
        imageUrl: [...formData.imageUrl, currentImageUrl.trim()],
      });
      setCurrentImageUrl("");
    }
  };

  const handleRemoveQuestionImage = (index: number) => {
    setFormData({
      ...formData,
      imageUrl: formData.imageUrl.filter((_, i) => i !== index),
    });
  };

  const handleAddOptionImage = (option: OptionForm) => {
    const key = option.id?.toString() || option.tempId || "";
    const url = optionImageUrls[key];
    if (url?.trim()) {
      setOptions(
        options.map((opt) =>
          (opt.id && opt.id === option.id) || (opt.tempId && opt.tempId === option.tempId)
            ? { ...opt, imageUrl: [...opt.imageUrl, url.trim()] }
            : opt
        )
      );
      setOptionImageUrls({ ...optionImageUrls, [key]: "" });
    }
  };

  const handleRemoveOptionImage = (option: OptionForm, index: number) => {
    setOptions(
      options.map((opt) =>
        (opt.id && opt.id === option.id) || (opt.tempId && opt.tempId === option.tempId)
          ? { ...opt, imageUrl: opt.imageUrl.filter((_, i) => i !== index) }
          : opt
      )
    );
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const validatedData = questionSchema.parse(formData);

      if (isEditing && question) {
        await updateQuestion(question.id, validatedData);

        for (const optionId of deletedOptionIds) {
          await deleteOption(optionId, true);
        }

        for (const option of options) {
          if (option.isNew) {
            await createOption({
              label: option.label,
              text: option.text,
              imageUrl: option.imageUrl,
              questionCode: formData.uniqueCode,
            });
          } else if (option.id) {
            await updateOption(option.id, {
              label: option.label,
              text: option.text,
              imageUrl: option.imageUrl,
            });
          }
        }

        toast.success("Pregunta actualizada exitosamente");
      } else {
        await createQuestion(validatedData);

        await Promise.all(
          options.map((option) =>
            createOption({
              label: option.label,
              text: option.text,
              imageUrl: option.imageUrl,
              questionCode: formData.uniqueCode,
            })
          )
        );

        toast.success("Pregunta creada exitosamente");
      }

      setTimeout(() => {
        router.push(ROUTES.ADMIN.QUESTIONS.LIST);
      }, 1000);
    } catch (error: any) {
      console.error("Error submitting question:", error);
      toast.error(error.message || "Error al guardar la pregunta");
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Información de la Pregunta</CardTitle>
          <CardDescription>
            {isEditing
              ? "Modifica los datos de la pregunta"
              : "Ingresa los datos de la nueva pregunta"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="uniqueCode">
                Código Único <span className="text-red-500">*</span>
              </Label>
              <Input
                id="uniqueCode"
                required
                value={formData.uniqueCode}
                onChange={(e) =>
                  setFormData({ ...formData, uniqueCode: e.target.value })
                }
                placeholder="Ej: MAT1630-P1-2024"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseCode">
                Curso <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.courseCode}
                onValueChange={(value) =>
                  setFormData({ ...formData, courseCode: value })
                }
                disabled={loadingCourses || isLoading}
              >
                <SelectTrigger id="courseCode" className="w-full">
                  <SelectValue placeholder="Seleccionar curso" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.code} value={course.code}>
                      {course.code} - {course.topic}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              Título <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Título de la pregunta"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">
              Contenido <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="content"
              required
              className="min-h-[100px]"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Contenido de la pregunta (soporta LaTeX)"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period">
                Período <span className="text-red-500">*</span>
              </Label>
              <Input
                id="period"
                required
                value={formData.period}
                onChange={(e) =>
                  setFormData({ ...formData, period: e.target.value })
                }
                placeholder="Ej: 2024-1"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">
                Tipo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="type"
                required
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                placeholder="Ej: Certamen, Tarea"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="correctLabel">Respuesta Correcta</Label>
            <Select
              value={formData.correctLabel}
              onValueChange={(value) =>
                setFormData({ ...formData, correctLabel: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger id="correctLabel" className="w-full">
                <SelectValue placeholder="Seleccionar respuesta correcta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="D">D</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="solution">Solución</Label>
            <Textarea
              id="solution"
              className="min-h-[100px]"
              value={formData.solution}
              onChange={(e) =>
                setFormData({ ...formData, solution: e.target.value })
              }
              placeholder="Solución detallada (soporta LaTeX)"
              disabled={isLoading}
            />
          </div>

          <Collapsible open={openSections.images}>
            <Card>
              <CardHeader className="cursor-pointer" onClick={() => toggleSection('images')}>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Imágenes</CardTitle>
                    <CardDescription>Sube las imágenes de la pregunta</CardDescription>
                  </div>
                  <ChevronDown className={`h-5 w-5 transition-transform ${openSections.images ? 'rotate-180' : ''}`} />
                </div>
              </CardHeader>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Subir Imágenes</Label>
                    <div 
                      className={`relative border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer ${
                        isDragging 
                          ? 'border-primary bg-primary/5' 
                          : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                      }`}
                      onClick={() => document.getElementById('image-upload')?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        multiple
                        onChange={(e) => handleImageUpload(e.target.files)}
                        disabled={uploadingImages || isLoading}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center justify-center gap-2 text-center">
                        {uploadingImages ? (
                          <>
                            <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Subiendo imágenes...</p>
                          </>
                        ) : (
                          <>
                            <CloudUpload className={`h-12 w-12 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                            <div className="space-y-1">
                              <p className="text-sm font-medium">
                                {isDragging ? 'Suelta los archivos aquí' : 'Haz clic para seleccionar o arrastra archivos aquí'}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Formatos permitidos: JPEG, PNG, WebP
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    {errors.images && (
                      <div className="space-y-1">
                        {Array.isArray(errors.images) ? (
                          errors.images.map((error, index) => (
                            <p key={index} className="text-sm text-destructive">• {error}</p>
                          ))
                        ) : (
                          <p className="text-sm text-destructive">{errors.images}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {errors.image && (
                    <div className="space-y-1">
                      <p className="text-sm text-destructive">• {errors.image}</p>
                    </div>
                  )}

                  {uploadedImages.length > 0 && (
                    <div className="space-y-2">
                      <Label>Imágenes subidas ({uploadedImages.length})</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {uploadedImages.map((url, index) => (
                          <div key={url} className="relative group">
                            <img
                              src={url}
                              alt={`Imagen ${index + 1}`}
                              className={`w-full h-24 object-cover rounded-md transition-all ${
                                url === mainImage 
                                  ? 'border-2 border-primary ring-2 ring-primary/20' 
                                  : 'border'
                              }`}
                            />
                            {url === mainImage && (
                              <Badge className="absolute top-1 left-1 text-xs" variant="default">
                                Principal
                              </Badge>
                            )}
                            <div className="absolute top-1 right-1 flex gap-1">
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => handleImageDelete(url)}
                                disabled={isLoading}
                                className="bg-white/90 hover:bg-white rounded-full transition-colors text-black hover:text-red-600 h-6 w-6"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                onClick={() => handleSetMainImage(url)}
                                disabled={isLoading}
                                className="bg-white/90 hover:bg-white rounded-full transition-colors h-6 w-6"
                              >
                                <Heart 
                                  className={`h-3 w-3 transition-colors ${
                                    url === mainImage ? 'text-red-600 fill-red-600' : 'text-gray-700'
                                  }`} 
                                />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Opciones de Respuesta</CardTitle>
              <CardDescription>
                Agrega las opciones de respuesta para la pregunta
              </CardDescription>
            </div>
            <Button
              type="button"
              onClick={handleAddOption}
              variant="outline"
              disabled={isLoading}
            >
              <Plus className="mr-2 h-4 w-4" />
              Agregar Opción
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {options.map((option) => {
            const optionKey = option.id?.toString() || option.tempId || "";
            return (
              <div
                key={optionKey}
                className="p-4 border rounded-lg space-y-3 bg-muted/30"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Opción {option.label}</h4>
                  {options.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOption(option)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`option-label-${optionKey}`}>
                    Etiqueta <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id={`option-label-${optionKey}`}
                    required
                    value={option.label}
                    onChange={(e) =>
                      handleOptionChange(option, "label", e.target.value)
                    }
                    placeholder="A, B, C, D..."
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`option-text-${optionKey}`}>
                    Texto <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id={`option-text-${optionKey}`}
                    required
                    className="min-h-[80px]"
                    value={option.text}
                    onChange={(e) =>
                      handleOptionChange(option, "text", e.target.value)
                    }
                    placeholder="Texto de la opción (soporta LaTeX)"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Imágenes de la Opción</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={optionImageUrls[optionKey] || ""}
                      onChange={(e) =>
                        setOptionImageUrls({
                          ...optionImageUrls,
                          [optionKey]: e.target.value,
                        })
                      }
                      placeholder="URL de la imagen"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      onClick={() => handleAddOptionImage(option)}
                      variant="outline"
                      disabled={isLoading}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  {option.imageUrl.length > 0 && (
                    <div className="space-y-2">
                      {option.imageUrl.map((url, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="flex items-center gap-2 p-2 bg-background rounded"
                        >
                          <span className="flex-1 text-sm truncate">{url}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleRemoveOptionImage(option, imgIndex)
                            }
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading
            ? isEditing
              ? "Guardando..."
              : "Creando..."
            : isEditing
            ? "Guardar Cambios"
            : "Crear Pregunta"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(ROUTES.ADMIN.QUESTIONS.LIST)}
          disabled={isLoading}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
