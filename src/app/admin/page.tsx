"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getImageUrlWithCacheBusting } from "@/utils/imageUtils";
import { authClient } from "@/lib/auth-client";

interface Marque {
  nom: string;
  description: string;
  description_fr?: string;
  description_en?: string;
  imageFolder: string;
  mainImage?: string;
  logo?: string;
  images?: string[];
  videos?: string[];
  tags?: string[];
  type?: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [marques, setMarques] = useState<Marque[]>([]);
  const [selectedMarque, setSelectedMarque] = useState<Marque | null>(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"marques" | "content">("marques");
  const [contentData, setContentData] = useState<Record<string, any>>({});
  const [selectedSection, setSelectedSection] = useState<string>("homepage");
  const [selectedSubsection, setSelectedSubsection] = useState<string>("hero");
  const [editingContent, setEditingContent] = useState<Record<string, any>>({});
  const [showAddMarque, setShowAddMarque] = useState(false);
  const [newMarque, setNewMarque] = useState<Partial<Marque>>({
    nom: "",
    description: "",
    description_fr: "",
    description_en: "",
    imageFolder: "",
    type: "",
    tags: [],
    images: [],
  });
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await authClient.getSession();
      if (!data?.user) {
        router.replace("/login");
      }
    };
    checkSession();
  }, [router]);

  // Charger les marques et le contenu
  useEffect(() => {
    fetchMarques();
    fetchContent();
  }, []);

  // Fonction pour forcer la mise à jour complète
  const forceRefreshMarques = useCallback(async () => {
    try {
      const res = await fetch("/api/cms/marques");
      const data = await res.json();
      setMarques(data.marques);

      // Mettre à jour la marque sélectionnée si elle existe
      if (selectedMarque) {
        const updatedMarque = data.marques.find(
          (m: Marque) => m.nom === selectedMarque.nom
        );
        if (updatedMarque) {
          setSelectedMarque(updatedMarque);
        }
      }

      setLastUpdate(new Date());
      return data.marques;
    } catch (error) {
      console.error("Erreur:", error);
      return [];
    }
  }, [selectedMarque]);

  // Auto-refresh toutes les 5 secondes si activé
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      forceRefreshMarques();
      fetchContent();

      // Notification discrète
      setShowUpdateNotification(true);
      setTimeout(() => setShowUpdateNotification(false), 2000);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, forceRefreshMarques]);

  const fetchMarques = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cms/marques");
      const data = await res.json();
      setMarques(data.marques);
      return data.marques;
    } catch (error) {
      console.error("Erreur lors de la lecture:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };


  const fetchContent = async () => {
    try {
      const res = await fetch("/api/cms/content");
      const data = await res.json();
      setContentData(data);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // Mettre à jour une marque
  const updateMarque = async (marque: Marque) => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/marques", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(marque),
      });

      if (res.ok) {
        await fetchMarques();
        setEditMode(false);
        setLastUpdate(new Date());
        alert("Marque mise à jour !");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
    setLoading(false);
  };

  // Supprimer une marque
  const deleteMarque = async (nom: string) => {
    if (!confirm(`Supprimer la marque ${nom} ?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/cms/marques?nom=${nom}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchMarques();
        setSelectedMarque(null);
        setLastUpdate(new Date());
        alert("Marque supprimée !");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
    setLoading(false);
  };

  // Upload d'image
  const uploadImage = async (
    file: File,
    action: string,
    replaceIndex?: number
  ) => {
    if (!selectedMarque) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("marque", selectedMarque.nom);
    formData.append("action", action);
    if (replaceIndex !== undefined) {
      formData.append("replaceIndex", replaceIndex.toString());
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cms/images", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        await forceRefreshMarques();
        alert("Image uploadée !");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
    setLoading(false);
  };

  // Supprimer une image
  const deleteImage = async (imageUrl: string, type: string) => {
    if (!selectedMarque) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/cms/images?marque=${selectedMarque.nom}&imageUrl=${imageUrl}&type=${type}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        await forceRefreshMarques();
        alert("Image supprimée !");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
    setLoading(false);
  };

  // Mettre à jour le contenu texte
  const updateContent = async (
    section: string,
    subsection: string,
    content: any
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/cms/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section, subsection, content }),
      });

      if (res.ok) {
        await fetchContent();
        setLastUpdate(new Date());
        alert("Contenu mis à jour !");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
    setLoading(false);
  };

  // Upload d'image de contenu
  const uploadContentImage = async (
    file: File,
    section: string,
    subsection: string,
    imageKey: string
  ) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("section", section);
      formData.append("subsection", subsection);
      formData.append("imageKey", imageKey);

      const res = await fetch("/api/cms/content-images", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        await fetchContent();
        setLastUpdate(new Date());
        alert("Image mise à jour !");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
    setLoading(false);
  };

  // Supprimer une image de contenu
  const deleteContentImage = async (
    section: string,
    subsection: string,
    imageKey: string
  ) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/cms/content-images?section=${section}&subsection=${subsection}&imageKey=${imageKey}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        await fetchContent();
        setLastUpdate(new Date());
        alert("Image supprimée !");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
    setLoading(false);
  };

  // Créer une nouvelle marque
  const createMarque = async () => {
    if (!newMarque.nom) {
      alert("Le nom de la marque est requis");
      return;
    }

    setLoading(true);
    try {
      const marqueData = {
        ...newMarque,
        imageFolder: newMarque.imageFolder || `/img/${newMarque.nom}/`,
        tags: newMarque.tags || [],
        images: newMarque.images || [],
      };

      const res = await fetch("/api/cms/marques", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(marqueData),
      });

      if (res.ok) {
        await forceRefreshMarques();
        setShowAddMarque(false);
        setNewMarque({
          nom: "",
          description: "",
          description_fr: "",
          description_en: "",
          imageFolder: "",
          type: "",
          tags: [],
          images: [],
        });
        alert("Marque créée !");
      } else {
        const error = await res.json();
        alert(error.error || "Erreur lors de la création");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la création");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (contentData[selectedSection]?.[selectedSubsection]) {
      setEditingContent(contentData[selectedSection][selectedSubsection]);
    }
  }, [selectedSection, selectedSubsection, contentData]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Admin - Gestion du Site
              </h1>
              <p className="text-gray-600">
                Gérez facilement les marques, images et contenus de votre site.
                Aucune authentification requise.
              </p>
            </div>
            <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoRefresh"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="autoRefresh" className="text-sm font-medium">
                  Mise à jour auto
                </label>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${
                    autoRefresh ? "bg-green-400 animate-pulse" : "bg-gray-400"
                  }`}
                ></div>
                Dernière MAJ: {lastUpdate.toLocaleTimeString()}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  forceRefreshMarques();
                  fetchContent();
                }}
              >
                🔄 Actualiser
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <Button
            variant={activeTab === "marques" ? "default" : "outline"}
            onClick={() => setActiveTab("marques")}
          >
            Marques
          </Button>
          <Button
            variant={activeTab === "content" ? "default" : "outline"}
            onClick={() => setActiveTab("content")}
          >
            Contenu du Site
          </Button>
        </div>

        {/* Tab Marques */}
        {activeTab === "marques" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Liste des marques */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Marques</CardTitle>
                    <Button
                      size="sm"
                      onClick={() => setShowAddMarque(true)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      + Ajouter
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {marques.map((marque) => (
                      <Button
                        key={marque.nom}
                        variant={
                          selectedMarque?.nom === marque.nom
                            ? "default"
                            : "outline"
                        }
                        className="w-full justify-start"
                        onClick={() => {
                          setSelectedMarque(marque);
                          setEditMode(false);
                        }}
                      >
                        {marque.nom}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Modal Ajouter Marque */}
              {showAddMarque && (
                <Card className="mt-4">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Nouvelle Marque</CardTitle>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowAddMarque(false)}
                      >
                        Annuler
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        createMarque();
                      }}
                      className="space-y-4"
                    >
                      <div>
                        <Label>Nom de la marque *</Label>
                        <Input
                          value={newMarque.nom || ""}
                          onChange={(e) =>
                            setNewMarque({ ...newMarque, nom: e.target.value })
                          }
                          placeholder="Ex: Nike"
                          required
                        />
                      </div>
                      <div>
                        <Label>Description courte</Label>
                        <textarea
                          className="w-full p-2 border rounded"
                          rows={2}
                          value={newMarque.description || ""}
                          onChange={(e) =>
                            setNewMarque({
                              ...newMarque,
                              description: e.target.value,
                            })
                          }
                          placeholder="Description courte de la marque"
                        />
                      </div>
                      <div>
                        <Label>Type</Label>
                        <Input
                          value={newMarque.type || ""}
                          onChange={(e) =>
                            setNewMarque({ ...newMarque, type: e.target.value })
                          }
                          placeholder="Ex: Vêtements sportifs"
                        />
                      </div>
                      <div>
                        <Label>Dossier images</Label>
                        <Input
                          value={newMarque.imageFolder || ""}
                          onChange={(e) =>
                            setNewMarque({
                              ...newMarque,
                              imageFolder: e.target.value,
                            })
                          }
                          placeholder={`/img/${newMarque.nom || "marque"}/`}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Laissez vide pour générer automatiquement
                        </p>
                      </div>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full"
                      >
                        Créer la marque
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Détails de la marque */}
            {selectedMarque && (
              <div className="lg:col-span-2 space-y-6">
                {/* Informations de base */}
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{selectedMarque.nom}</CardTitle>
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setEditMode(!editMode)}
                        >
                          {editMode ? "Annuler" : "Modifier"}
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => deleteMarque(selectedMarque.nom)}
                        >
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editMode ? (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          updateMarque(selectedMarque);
                        }}
                        className="space-y-4"
                      >
                        <div>
                          <Label>Description FR</Label>
                          <textarea
                            className="w-full p-2 border rounded"
                            rows={4}
                            value={selectedMarque.description_fr || ""}
                            onChange={(e) =>
                              setSelectedMarque({
                                ...selectedMarque,
                                description_fr: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Description EN</Label>
                          <textarea
                            className="w-full p-2 border rounded"
                            rows={4}
                            value={selectedMarque.description_en || ""}
                            onChange={(e) =>
                              setSelectedMarque({
                                ...selectedMarque,
                                description_en: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Description courte</Label>
                          <textarea
                            className="w-full p-2 border rounded"
                            rows={2}
                            value={selectedMarque.description}
                            onChange={(e) =>
                              setSelectedMarque({
                                ...selectedMarque,
                                description: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Type</Label>
                          <Input
                            value={selectedMarque.type || ""}
                            onChange={(e) =>
                              setSelectedMarque({
                                ...selectedMarque,
                                type: e.target.value,
                              })
                            }
                          />
                        </div>
                        <Button type="submit" disabled={loading}>
                          Sauvegarder
                        </Button>
                      </form>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold">Description FR:</h4>
                          <p className="text-sm text-gray-600">
                            {selectedMarque.description_fr}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Description EN:</h4>
                          <p className="text-sm text-gray-600">
                            {selectedMarque.description_en}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Type:</h4>
                          <p className="text-sm text-gray-600">
                            {selectedMarque.type}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Gestion des images */}
                <Card>
                  <CardHeader>
                    <CardTitle>Images</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Logo */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Logo</h4>
                        <Button
                          size="sm"
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement)
                                .files?.[0];
                              if (file) uploadImage(file, "logo");
                            };
                            input.click();
                          }}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          {selectedMarque.logo ? "Changer" : "+ Ajouter"}
                        </Button>
                      </div>
                      {selectedMarque.logo ? (
                        <div className="flex items-center gap-4 p-4 border rounded-lg">
                          <Image
                            src={getImageUrlWithCacheBusting(selectedMarque.logo)}
                            alt="Logo"
                            width={80}
                            height={80}
                            className="h-20 w-auto"
                            unoptimized // Nécessaire pour les images uploadées dynamiquement
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              deleteImage(selectedMarque.logo!, "logo")
                            }
                          >
                            Supprimer
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                          <p>Aucun logo</p>
                          <p className="text-sm">
                            Cliquez sur &quot;Ajouter&quot; pour en ajouter un
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Image principale */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Image principale</h4>
                        <Button
                          size="sm"
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement)
                                .files?.[0];
                              if (file) uploadImage(file, "mainImage");
                            };
                            input.click();
                          }}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          {selectedMarque.mainImage ? "Changer" : "+ Ajouter"}
                        </Button>
                      </div>
                      {selectedMarque.mainImage ? (
                        <div className="p-4 border rounded-lg">
                          <Image
                            src={getImageUrlWithCacheBusting(selectedMarque.mainImage)}
                            alt="Main"
                            width={160}
                            height={160}
                            className="h-40 w-auto rounded mb-3"
                            unoptimized // Nécessaire pour les images uploadées dynamiquement
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              deleteImage(selectedMarque.mainImage!, "main")
                            }
                          >
                            Supprimer
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                          <p>Aucune image principale</p>
                          <p className="text-sm">
                            Cliquez sur &quot;Ajouter&quot; pour en ajouter une
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Galerie */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Galerie</h4>
                        <Button
                          size="sm"
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement)
                                .files?.[0];
                              if (file) uploadImage(file, "add");
                            };
                            input.click();
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          + Ajouter Image
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {selectedMarque.images?.map((img, index) => (
                          <div key={index} className="relative group">
                            <Image
                              src={getImageUrlWithCacheBusting(img)}
                              alt={`Image ${index + 1}`}
                              width={200}
                              height={128}
                              className="w-full h-32 object-cover rounded"
                              unoptimized // Nécessaire pour les images uploadées dynamiquement
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => {
                                  const input = document.createElement("input");
                                  input.type = "file";
                                  input.accept = "image/*";
                                  input.onchange = (e) => {
                                    const file = (e.target as HTMLInputElement)
                                      .files?.[0];
                                    if (file)
                                      uploadImage(file, "replace", index);
                                  };
                                  input.click();
                                }}
                              >
                                Remplacer
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteImage(img, "gallery")}
                              >
                                Supprimer
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      {(!selectedMarque.images ||
                        selectedMarque.images.length === 0) && (
                        <div className="text-center py-8 text-gray-500">
                          <p>Aucune image dans la galerie</p>
                          <p className="text-sm">
                            Cliquez sur &quot;Ajouter Image&quot; pour commencer
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Tab Contenu */}
        {activeTab === "content" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Navigation */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Sections</CardTitle>
                    <div className="text-xs text-gray-500">
                      {Object.keys(contentData).length} section(s)
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <Button
                      variant={
                        selectedSection === "homepage" ? "default" : "outline"
                      }
                      className="w-full justify-start"
                      onClick={() => {
                        setSelectedSection("homepage");
                        setSelectedSubsection("hero");
                      }}
                    >
                      Page d&apos;accueil
                    </Button>
                    <Button
                      variant={
                        selectedSection === "arpin" ? "default" : "outline"
                      }
                      className="w-full justify-start"
                      onClick={() => {
                        setSelectedSection("arpin");
                        setSelectedSubsection("hero");
                      }}
                    >
                      Page Arpin
                    </Button>
                  </div>

                  {selectedSection && contentData[selectedSection] && (
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">Sous-sections:</h4>
                        <div className="text-xs text-gray-500">
                          {Object.keys(contentData[selectedSection]).length}{" "}
                          item(s)
                        </div>
                      </div>
                      <div className="space-y-1">
                        {Object.keys(contentData[selectedSection]).map(
                          (key) => (
                            <Button
                              key={key}
                              variant={
                                selectedSubsection === key ? "default" : "ghost"
                              }
                              size="sm"
                              className="w-full justify-start text-left"
                              onClick={() => setSelectedSubsection(key)}
                            >
                              <span className="flex-1 text-left">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                              </span>
                              <span className="text-xs text-gray-400">
                                {
                                  Object.keys(
                                    contentData[selectedSection][key] || {}
                                  ).length
                                }
                              </span>
                            </Button>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Éditeur de contenu */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Éditer: {selectedSection} / {selectedSubsection}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editingContent && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        updateContent(
                          selectedSection,
                          selectedSubsection,
                          editingContent
                        );
                      }}
                      className="space-y-4"
                    >
                      {Object.keys(editingContent).map((key) => {
                        const value = editingContent[key];
                        const isArray = Array.isArray(value);
                        const isLongText =
                          typeof value === "string" && value.length > 100;
                        const isImageField =
                          key.includes("image") || key.includes("Image");

                        return (
                          <div key={key}>
                            <Label className="capitalize">
                              {key.replace(/_/g, " ")}
                            </Label>

                            {isImageField && typeof value === "string" ? (
                              <div className="space-y-2">
                                {value ? (
                                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                                    <Image
                                      src={value}
                                      alt={key}
                                      width={80}
                                      height={80}
                                      className="h-20 w-20 object-cover rounded"
                                      unoptimized // Nécessaire pour les images uploadées dynamiquement
                                    />
                                    <div className="flex gap-2">
                                      <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => {
                                          const input =
                                            document.createElement("input");
                                          input.type = "file";
                                          input.accept = "image/*";
                                          input.onchange = (e) => {
                                            const file = (
                                              e.target as HTMLInputElement
                                            ).files?.[0];
                                            if (file)
                                              uploadContentImage(
                                                file,
                                                selectedSection,
                                                selectedSubsection,
                                                key
                                              );
                                          };
                                          input.click();
                                        }}
                                        className="bg-orange-600 hover:bg-orange-700"
                                      >
                                        Changer
                                      </Button>
                                      <Button
                                        type="button"
                                        size="sm"
                                        variant="destructive"
                                        onClick={() =>
                                          deleteContentImage(
                                            selectedSection,
                                            selectedSubsection,
                                            key
                                          )
                                        }
                                      >
                                        Supprimer
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                                    <p>Aucune image</p>
                                    <Button
                                      type="button"
                                      size="sm"
                                      onClick={() => {
                                        const input =
                                          document.createElement("input");
                                        input.type = "file";
                                        input.accept = "image/*";
                                        input.onchange = (e) => {
                                          const file = (
                                            e.target as HTMLInputElement
                                          ).files?.[0];
                                          if (file)
                                            uploadContentImage(
                                              file,
                                              selectedSection,
                                              selectedSubsection,
                                              key
                                            );
                                        };
                                        input.click();
                                      }}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      + Ajouter Image
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ) : isArray ? (
                              <div className="space-y-2">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-gray-600">
                                    {value.length} élément(s)
                                  </span>
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => {
                                      setEditingContent({
                                        ...editingContent,
                                        [key]: [...value, ""],
                                      });
                                    }}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    + Ajouter
                                  </Button>
                                </div>
                                {value.map((item: any, index: number) => (
                                  <div
                                    key={index}
                                    className="border rounded p-4 space-y-2"
                                  >
                                    {typeof item === "object" &&
                                    item !== null ? (
                                      // Gestion des objets dans le tableau (ex: membres d'équipe)
                                      <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                          <h4 className="font-medium text-sm">
                                            Élément {index + 1}
                                          </h4>
                                          <Button
                                            type="button"
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => {
                                              const newArray = value.filter(
                                                (_: any, i: number) =>
                                                  i !== index
                                              );
                                              setEditingContent({
                                                ...editingContent,
                                                [key]: newArray,
                                              });
                                            }}
                                          >
                                            ×
                                          </Button>
                                        </div>
                                        {Object.keys(item).map((objKey) => {
                                          const objValue = item[objKey];
                                          const isObjImageField =
                                            objKey.includes("image") ||
                                            objKey.includes("Image");

                                          return (
                                            <div key={objKey}>
                                              <Label className="text-xs">
                                                {objKey}
                                              </Label>
                                              {isObjImageField &&
                                              typeof objValue === "string" ? (
                                                <div className="space-y-2">
                                                  {objValue ? (
                                                    <div className="flex items-center gap-2 p-2 border rounded">
                                                      <Image
                                                        src={objValue}
                                                        alt={objKey}
                                                        width={48}
                                                        height={48}
                                                        className="h-12 w-12 object-cover rounded"
                                                        unoptimized // Nécessaire pour les images uploadées dynamiquement
                                                      />
                                                      <div className="flex gap-1">
                                                        <Button
                                                          type="button"
                                                          size="sm"
                                                          onClick={() => {
                                                            const input =
                                                              document.createElement(
                                                                "input"
                                                              );
                                                            input.type = "file";
                                                            input.accept =
                                                              "image/*";
                                                            input.onchange = (
                                                              e
                                                            ) => {
                                                              const file = (
                                                                e.target as HTMLInputElement
                                                              ).files?.[0];
                                                              if (file)
                                                                uploadContentImage(
                                                                  file,
                                                                  selectedSection,
                                                                  selectedSubsection,
                                                                  `${key}.${index}.${objKey}`
                                                                );
                                                            };
                                                            input.click();
                                                          }}
                                                          className="bg-orange-600 hover:bg-orange-700 text-xs px-2 py-1"
                                                        >
                                                          Changer
                                                        </Button>
                                                        <Button
                                                          type="button"
                                                          size="sm"
                                                          variant="destructive"
                                                          onClick={() =>
                                                            deleteContentImage(
                                                              selectedSection,
                                                              selectedSubsection,
                                                              `${key}.${index}.${objKey}`
                                                            )
                                                          }
                                                          className="text-xs px-2 py-1"
                                                        >
                                                          ×
                                                        </Button>
                                                      </div>
                                                    </div>
                                                  ) : (
                                                    <Button
                                                      type="button"
                                                      size="sm"
                                                      onClick={() => {
                                                        const input =
                                                          document.createElement(
                                                            "input"
                                                          );
                                                        input.type = "file";
                                                        input.accept =
                                                          "image/*";
                                                        input.onchange = (
                                                          e
                                                        ) => {
                                                          const file = (
                                                            e.target as HTMLInputElement
                                                          ).files?.[0];
                                                          if (file)
                                                            uploadContentImage(
                                                              file,
                                                              selectedSection,
                                                              selectedSubsection,
                                                              `${key}.${index}.${objKey}`
                                                            );
                                                        };
                                                        input.click();
                                                      }}
                                                      className="bg-green-600 hover:bg-green-700 text-xs"
                                                    >
                                                      + Ajouter Image
                                                    </Button>
                                                  )}
                                                </div>
                                              ) : (
                                                <Input
                                                  value={objValue}
                                                  onChange={(e) => {
                                                    const newArray = [...value];
                                                    newArray[index] = {
                                                      ...newArray[index],
                                                      [objKey]: e.target.value,
                                                    };
                                                    setEditingContent({
                                                      ...editingContent,
                                                      [key]: newArray,
                                                    });
                                                  }}
                                                  placeholder={objKey}
                                                  className="text-xs"
                                                />
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      // Gestion des chaînes simples
                                      <div className="flex gap-2">
                                        <Input
                                          value={item}
                                          onChange={(e) => {
                                            const newArray = [...value];
                                            newArray[index] = e.target.value;
                                            setEditingContent({
                                              ...editingContent,
                                              [key]: newArray,
                                            });
                                          }}
                                          placeholder={`${key} ${index + 1}`}
                                        />
                                        <Button
                                          type="button"
                                          size="sm"
                                          variant="destructive"
                                          onClick={() => {
                                            const newArray = value.filter(
                                              (_: any, i: number) => i !== index
                                            );
                                            setEditingContent({
                                              ...editingContent,
                                              [key]: newArray,
                                            });
                                          }}
                                        >
                                          ×
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                ))}
                                {value.length === 0 && (
                                  <div className="text-center py-4 text-gray-500 border-2 border-dashed rounded">
                                    <p>Aucun élément</p>
                                    <p className="text-sm">
                                      Cliquez sur &quot;Ajouter&quot; pour commencer
                                    </p>
                                  </div>
                                )}
                              </div>
                            ) : isLongText ? (
                              <textarea
                                className="w-full p-2 border rounded"
                                rows={4}
                                value={value}
                                onChange={(e) =>
                                  setEditingContent({
                                    ...editingContent,
                                    [key]: e.target.value,
                                  })
                                }
                              />
                            ) : typeof value === "object" && value !== null ? (
                              <div className="ml-4 p-4 bg-gray-50 rounded space-y-2">
                                {Object.keys(value).map((subKey) => {
                                  const subValue = value[subKey];
                                  const isSubImageField =
                                    subKey.includes("image") ||
                                    subKey.includes("Image");

                                  return (
                                    <div key={subKey}>
                                      <Label className="text-sm">
                                        {subKey}
                                      </Label>
                                      {isSubImageField &&
                                      typeof subValue === "string" ? (
                                        <div className="space-y-2">
                                          {subValue ? (
                                            <div className="flex items-center gap-4 p-2 border rounded">
                                              <Image
                                                src={subValue}
                                                alt={subKey}
                                                width={64}
                                                height={64}
                                                className="h-16 w-16 object-cover rounded"
                                                unoptimized // Nécessaire pour les images uploadées dynamiquement
                                              />
                                              <div className="flex gap-2">
                                                <Button
                                                  type="button"
                                                  size="sm"
                                                  onClick={() => {
                                                    const input =
                                                      document.createElement(
                                                        "input"
                                                      );
                                                    input.type = "file";
                                                    input.accept = "image/*";
                                                    input.onchange = (e) => {
                                                      const file = (
                                                        e.target as HTMLInputElement
                                                      ).files?.[0];
                                                      if (file)
                                                        uploadContentImage(
                                                          file,
                                                          selectedSection,
                                                          selectedSubsection,
                                                          `${key}.${subKey}`
                                                        );
                                                    };
                                                    input.click();
                                                  }}
                                                  className="bg-orange-600 hover:bg-orange-700 text-xs"
                                                >
                                                  Changer
                                                </Button>
                                                <Button
                                                  type="button"
                                                  size="sm"
                                                  variant="destructive"
                                                  onClick={() =>
                                                    deleteContentImage(
                                                      selectedSection,
                                                      selectedSubsection,
                                                      `${key}.${subKey}`
                                                    )
                                                  }
                                                  className="text-xs"
                                                >
                                                  Supprimer
                                                </Button>
                                              </div>
                                            </div>
                                          ) : (
                                            <Button
                                              type="button"
                                              size="sm"
                                              onClick={() => {
                                                const input =
                                                  document.createElement(
                                                    "input"
                                                  );
                                                input.type = "file";
                                                input.accept = "image/*";
                                                input.onchange = (e) => {
                                                  const file = (
                                                    e.target as HTMLInputElement
                                                  ).files?.[0];
                                                  if (file)
                                                    uploadContentImage(
                                                      file,
                                                      selectedSection,
                                                      selectedSubsection,
                                                      `${key}.${subKey}`
                                                    );
                                                };
                                                input.click();
                                              }}
                                              className="bg-green-600 hover:bg-green-700 text-xs"
                                            >
                                              + Ajouter Image
                                            </Button>
                                          )}
                                        </div>
                                      ) : (
                                        <Input
                                          value={subValue}
                                          onChange={(e) =>
                                            setEditingContent({
                                              ...editingContent,
                                              [key]: {
                                                ...value,
                                                [subKey]: e.target.value,
                                              },
                                            })
                                          }
                                        />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <Input
                                value={value}
                                onChange={(e) =>
                                  setEditingContent({
                                    ...editingContent,
                                    [key]: e.target.value,
                                  })
                                }
                              />
                            )}
                          </div>
                        );
                      })}

                      <div className="flex gap-4 pt-4 border-t">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="flex-1"
                        >
                          {loading
                            ? "Sauvegarde..."
                            : "Sauvegarder les modifications"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            if (
                              contentData[selectedSection]?.[selectedSubsection]
                            ) {
                              setEditingContent(
                                contentData[selectedSection][selectedSubsection]
                              );
                            }
                          }}
                        >
                          Annuler
                        </Button>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Notification de mise à jour automatique */}
        {showUpdateNotification && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-slide-up">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm">Données mises à jour</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
