import { Fragment } from 'react';
import { Trash2 } from 'lucide-react';
import { GripVertical } from 'lucide-react';
import { FieldDefinition } from '@/types/schema';
import { DataTypeSelect } from './DataTypeSelect';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { DropResult } from '@hello-pangea/dnd';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslation } from '@/lib/i18n';

interface DataTypeFormProps {
  fields: FieldDefinition[];
  onUpdate: (fields: FieldDefinition[]) => void;
  parentId?: string;
  isItemDefinition?: boolean;
}

export function DataTypeForm({ fields, onUpdate, parentId, isItemDefinition }: DataTypeFormProps) {
  const { language } = useLanguage();

  const addField = () => {
    const newField: FieldDefinition = {
      id: crypto.randomUUID(),
      name: '',
      type: 'string',
    };
    onUpdate([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<FieldDefinition>) => {
    const newFields = fields.map((field) => {
      if (field.id === id) {
        const updatedField = { ...field, ...updates };

        if (updates.type && updates.type !== field.type) {
          delete updatedField.fields;
          delete updatedField.itemDefinition;
          delete updatedField.options;

          if (updates.type === 'object') {
            updatedField.fields = [];
          } else if (updates.type === 'array') {
            updatedField.itemDefinition = {
              id: crypto.randomUUID(),
              name: 'item',
              type: 'string',
            };
          }
        }
        return updatedField;
      }
      return field;
    });
    onUpdate(newFields);
  };

  const removeField = (id: string) => {
    onUpdate(fields.filter((field) => field.id !== id));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newFields = Array.from(fields);
    const [removed] = newFields.splice(result.source.index, 1);
    newFields.splice(result.destination.index, 0, removed);
    onUpdate(newFields);
  };

  const droppableId = parentId ? `fields-droppable-${parentId}` : "fields-droppable";

  // Consistent wrapper class for all options
  const optionWrapperClass = `mt-1 p-2 border rounded space-y-2 ml-8 bg-gray-50`;
  const optionGridClass = "grid grid-cols-[auto_1fr] items-center gap-4";

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={droppableId} key={droppableId} isDropDisabled={isItemDefinition}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
            {!isItemDefinition && (
              <div className="grid grid-cols-[32px_1fr_260px_32px] gap-0 items-center text-sm text-gray-500 font-medium border-b border-gray-300">
                <div className="w-8 select-none flex items-center justify-center invisible">☰</div>
                <div className="px-2 py-1 border-r border-gray-200">{getTranslation(language, 'field_name')}</div>
                <div className="px-2 py-1 border-r border-gray-200">{getTranslation(language, 'data_type')}</div>
                <div className="w-8 flex items-center justify-center invisible">
                  <Trash2 className="w-5 h-5" />
                </div>
              </div>
            )}
            {fields.map((field, idx) => (
              <Draggable key={String(field.id)} draggableId={String(field.id)} index={idx} isDragDisabled={isItemDefinition}>
                {(provided, snapshot) => (
                  <Fragment>
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`grid ${isItemDefinition ? 'grid-cols-[1fr_260px]' : 'grid-cols-[32px_1fr_260px_32px]'} gap-0 items-center bg-white ${!isItemDefinition ? 'border-b border-gray-200' : ''} ${snapshot.isDragging ? 'ring-2 ring-blue-400' : ''}`}
                    >
                      {!isItemDefinition && (
                        <div {...provided.dragHandleProps} className="cursor-move flex items-center justify-center w-8 h-8"><GripVertical className="w-5 h-5" /></div>
                      )}
                      
                      {!isItemDefinition ? (
                        <input
                          type="text"
                          value={field.name}
                          onChange={(e) => updateField(field.id, { name: e.target.value })}
                          className="px-2 py-1 border-none bg-transparent w-full focus:outline-none"
                          placeholder={getTranslation(language, 'field_name')}
                        />
                      ) : (
                        <div className="px-2 py-1 font-medium text-gray-600">{getTranslation(language, 'array_item_type')}</div>
                      )}

                      <div className="px-2 py-1">
                        <DataTypeSelect
                          value={field.type}
                          onChange={(type) => updateField(field.id, { type })}
                          allowNestedTypes
                        />
                      </div>

                      {!isItemDefinition && (
                        <button
                          onClick={() => removeField(field.id)}
                          className="flex items-center justify-center w-8 h-8 bg-red-50 hover:bg-red-100 rounded"
                          title={getTranslation(language, 'remove')}
                        >
                          <Trash2 className="w-5 h-5 text-red-500" />
                        </button>
                      )}
                    </div>

                    {field.type === 'currency' && (
                      <div className={optionWrapperClass}>
                        <div className={optionGridClass}>
                          <label className="text-gray-700 font-medium whitespace-nowrap">Currency Type</label>
                          <select
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={field.options?.currencyType ?? 'yen'}
                            onChange={e => updateField(field.id, { options: { ...field.options, currencyType: e.target.value as 'yen' | 'dollar' } })}
                          >
                            <option value="yen">{getTranslation(language, 'yen')}</option>
                            <option value="dollar">{getTranslation(language, 'dollar')}</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {field.type === 'ipAddress' && (
                      <div className={optionWrapperClass}>
                        <div className={optionGridClass}>
                          <label className="text-gray-700 font-medium whitespace-nowrap">IP version</label>
                          <select
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={field.options?.ipVersion ?? 'IPv4'}
                            onChange={e => updateField(field.id, { options: { ...field.options, ipVersion: e.target.value as 'IPv4' | 'IPv6' } })}
                          >
                            <option value="IPv4">IPv4</option>
                            <option value="IPv6">IPv6</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {field.type === 'latLong' && (
                      <div className={optionWrapperClass}>
                        <div className={optionGridClass}>
                          <label className="text-gray-700 font-medium whitespace-nowrap">Lat/Long Type</label>
                          <select
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={field.options?.latLongType ?? 'both'}
                            onChange={e => updateField(field.id, { options: { ...field.options, latLongType: e.target.value as 'latitude' | 'longitude' | 'both' } })}
                          >
                            <option value="both">{getTranslation(language, 'lat_long_both')}</option>
                            <option value="latitude">{getTranslation(language, 'lat_only')}</option>
                            <option value="longitude">{getTranslation(language, 'long_only')}</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {field.type === 'object' && (
                      <div className={optionWrapperClass}>
                        <h3 className="text-md font-bold mb-2">{getTranslation(language, 'object_fields')}</h3>
                        <DataTypeForm
                          fields={field.fields || []}
                          onUpdate={(newFields) => updateField(field.id, { fields: newFields })}
                          parentId={field.id}
                        />
                      </div>
                    )}

                    {field.type === 'array' && (
                      <div className={optionWrapperClass}>
                        <div className={optionGridClass}>
                          <label className="text-gray-700 font-medium whitespace-nowrap">{getTranslation(language, 'array_length')}</label>
                          <input
                            type="number"
                            min="0"
                            value={field.options?.arrayLength ?? 1}
                            onChange={(e) => {
                              const newArrayLength = parseInt(e.target.value);
                              updateField(field.id, {
                                options: { ...field.options, arrayLength: isNaN(newArrayLength) ? 1 : newArrayLength },
                              });
                            }}
                            className="w-24 px-2 py-1 border rounded"
                          />
                        </div>

                        {field.itemDefinition && (
                          <div className="border-t pt-2">
                            <DataTypeForm
                              fields={[field.itemDefinition]}
                              onUpdate={(updatedItems) => {
                                updateField(field.id, { itemDefinition: updatedItems[0] });
                              }}
                              parentId={field.id}
                              isItemDefinition={true}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </Fragment>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {!isItemDefinition && (
              <button
                onClick={addField}
                className="w-full bg-gray-100 p-2 rounded hover:bg-gray-200 mt-2"
              >
                {getTranslation(language, 'add_field')}
              </button>
            )}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}