import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash2, AlertTriangle } from "lucide-react";

interface Review {
  id: string;
  reviewer: string;
  company: string;
  rating: number;
  text: string;
  status: "visible" | "flagged" | "hidden";
  postedDate: string;
}

const AdminReviews = () => {
  const reviews: Review[] = [
    { id: "rev1", reviewer: "Alpha Diallo", company: "MinéGuinée SA", rating: 5, text: "Excellente expérience de travail!", status: "visible", postedDate: "2025-02-10" },
    { id: "rev2", reviewer: "Mamadou Bah", company: "TechSolutions GN", rating: 1, text: "Essai SPAM SPAM SPAM!!!", status: "flagged", postedDate: "2025-02-12" },
    { id: "rev3", reviewer: "Fatoumata Sy", company: "MinéGuinée SA", rating: 4, text: "Bonne gestion d'équipe", status: "visible", postedDate: "2025-02-08" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Gestion des avis & notation</h2>
          <p className="text-muted-foreground">Modération des avis et gestion du SuguScore</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Avis ({reviews.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border border-border rounded-lg p-4 hover:bg-muted">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">{review.reviewer}</p>
                    <p className="text-sm text-muted-foreground">Pour {review.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={review.status === "visible" ? "default" : "destructive"}>
                      {review.status}
                    </Badge>
                  </div>
                </div>
                <div className="mb-2">
                  <span className="text-lg">{"⭐".repeat(review.rating)}</span>
                  <span className="text-muted-foreground"> {review.rating}/5</span>
                </div>
                <p className="text-sm mb-3">{review.text}</p>
                <p className="text-xs text-muted-foreground mb-3">{new Date(review.postedDate).toLocaleDateString("fr-FR")}</p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm"><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  {review.status === "flagged" && <Button variant="ghost" size="sm"><AlertTriangle className="h-4 w-4 text-warning" /></Button>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;
