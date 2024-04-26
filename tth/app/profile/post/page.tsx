"use client";
import React, { useState, useEffect } from "react";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import {
  getFirestore,
  collection,
  getDocs,
  DocumentData,
  where,
  query,
} from "firebase/firestore";
import { db, auth } from "@/app/firebase";

/**
 * Represents the data structure of an item.
 */
interface Items {
  id: string;
  title: string;
  link: string;
  tag: string;
  description: string;
  user_id: string;
}

interface Props {
  projects: Items[];
}

/**
 * Represents the Post page.
 * @returns JSX.Element representing the Post page.
 */
export default function Home() {
  const [currentUserProjects, setCurrentUserProjects] = useState<Items[]>([]);

  useEffect(() => {
    // Check if there's a current user
    const user = auth.currentUser;
    if (user) {
      fetchCurrentUserProjects(user.uid);
    }
  }, []);

  /**
   * Fetches the projects created by the current user.
   * @param userId The ID of the current user.
   */
  async function fetchCurrentUserProjects(userId: string) {
    try {
      const q = query(
        collection(db, "Item"),
        where("user_id", "==", userId),
        where("sold", "==", false)
      );
      const querySnapshot = await getDocs(q);
      const projects: Items[] = [];
      querySnapshot.forEach((doc: DocumentData) => {
        projects.push({ id: doc.id, ...doc.data() });
      });
      setCurrentUserProjects(projects);
    } catch (error) {
      console.error("Error fetching user projects:", error);
    }
  }

  return (
    <div className="">
      <div className="text-center flex-grow">
        <CardHoverEffectDemo projects={currentUserProjects} />
      </div>
    </div>
  );
}

/**
 * Represents the component for displaying card hover effect.
 * @param projects The list of projects to display.
 * @returns JSX.Element representing the CardHoverEffectDemo component.
 */
function CardHoverEffectDemo({ projects }: Props) {
  return (
    <div>
      <div>
        <h3 className="text-lg font-medium">My Posts</h3>
      </div>
      <div className="">
        <HoverEffect items={projects} />
      </div>
    </div>
  );
}
