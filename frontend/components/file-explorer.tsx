"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Folder, File, ChevronRight, ChevronDown, Code, FileText, Database } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock file structure for the source code
const sourceCodeStructure = {
  sourcecode: {
    type: "folder",
    children: {
      "arima_model.pkl": { type: "file", extension: "pkl" },
      "data_preprocessing.py": { type: "file", extension: "py" },
      "model_training.py": { type: "file", extension: "py" },
      "evaluation.py": { type: "file", extension: "py" },
      "utils.py": { type: "file", extension: "py" },
      data: {
        type: "folder",
        children: {
          "commodity_prices.csv": { type: "file", extension: "csv" },
          "centers.csv": { type: "file", extension: "csv" },
          "processed_data.csv": { type: "file", extension: "csv" },
        },
      },
      notebooks: {
        type: "folder",
        children: {
          "exploratory_analysis.ipynb": { type: "file", extension: "ipynb" },
          "model_comparison.ipynb": { type: "file", extension: "ipynb" },
        },
      },
      models: {
        type: "folder",
        children: {
          "lstm_model.h5": { type: "file", extension: "h5" },
          "xgboost_model.pkl": { type: "file", extension: "pkl" },
          "sarima_model.pkl": { type: "file", extension: "pkl" },
        },
      },
    },
  },
}

interface FileExplorerProps {
  structure: any
  level?: number
  path?: string[]
}

const FileExplorer = ({ structure, level = 0, path = [] }: FileExplorerProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    sourcecode: true, // Start with root expanded
  })

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath],
    }))
  }

  const getFileIcon = (extension: string) => {
    switch (extension) {
      case "py":
        return <Code className="h-4 w-4 text-blue-500" />
      case "ipynb":
        return <FileText className="h-4 w-4 text-orange-500" />
      case "csv":
        return <FileText className="h-4 w-4 text-green-500" />
      case "pkl":
        return <FileText className="h-4 w-4 text-purple-500" />
      case "h5":
        return <FileText className="h-4 w-4 text-red-500" />
      default:
        return <File className="h-4 w-4" />
    }
  }

  const renderFileSystem = (structure: any, currentPath: string[] = []) => {
    return Object.entries(structure).map(([name, details]: [string, any]) => {
      const fullPath = [...currentPath, name].join("/")

      if (details.type === "folder") {
        const isExpanded = expandedFolders[fullPath] || false
        return (
          <div key={fullPath}>
            <div
              className={cn(
                "flex items-center py-1 px-2 rounded-md cursor-pointer hover:bg-muted",
                level > 0 && "ml-4",
              )}
              onClick={() => toggleFolder(fullPath)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 mr-1 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1 text-muted-foreground" />
              )}
              <Folder className="h-4 w-4 mr-2 text-blue-500" />
              <span>{name}</span>
            </div>
            {isExpanded && <div className="ml-4">{renderFileSystem(details.children, [...currentPath, name])}</div>}
          </div>
        )
      } else {
        return (
          <div
            key={fullPath}
            className={cn("flex items-center py-1 px-2 rounded-md hover:bg-muted", level > 0 && "ml-4")}
          >
            <div className="w-4 mr-1"></div>
            {getFileIcon(details.extension)}
            <span className="ml-2">{name}</span>
          </div>
        )
      }
    })
  }

  return <div className="text-sm">{renderFileSystem(structure, path)}</div>
}

export function SourceCodeExplorer() {
  return (
    <Card className="dashboard-card rounded-2xl">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-start gap-3"><div className="rounded-xl bg-amber-100 p-2 text-amber-700"><Database className="h-4 w-4" /></div><div><CardTitle className="font-display text-xl">Model workspace</CardTitle>
        <CardDescription className="mt-1">Assets supporting this forecast engine</CardDescription></div></div>
      </CardHeader>
      <CardContent className="p-6 pt-1">
        <FileExplorer structure={sourceCodeStructure} />
      </CardContent>
    </Card>
  )
}
