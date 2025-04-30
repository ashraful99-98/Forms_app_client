import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

interface ItemType {
  id: string;
  content: string;
}

const DragAndDrop: React.FC = () => {
  const [items, setItems] = useState<ItemType[]>([
    { id: "item-0", content: "item 0" },
    { id: "item-1", content: "item 1" },
    { id: "item-2", content: "item 2" },
    { id: "item-3", content: "item 3" },
    { id: "item-4", content: "item 4" },
  ]);

  const reorder = (
    list: ItemType[],
    startIndex: number,
    endIndex: number
  ): ItemType[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reorderedItems = reorder(
      items,
      result.source.index,
      result.destination.index
    );
    setItems(reorderedItems);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{
              padding: 8,
              background: snapshot.isDraggingOver ? "#f0f0f0" : "#ffffff",
            }}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      userSelect: "none",
                      padding: 16,
                      margin: "0 0 8px 0",
                      background: snapshot.isDragging ? "#e0e0e0" : "#fafafa",
                      border: "1px solid #ddd",
                      ...provided.draggableProps.style,
                    }}
                  >
                    {item.content}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DragAndDrop;
