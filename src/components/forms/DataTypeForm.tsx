import { Fragment } from 'react';
import { Trash2 } from 'lucide-react';
import { GripVertical } from 'lucide-react';
import { DataType, FieldDefinition } from '@/types/schema';
import { DataTypeSelect } from './DataTypeSelect';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { DropResult } from '@hello-pangea/dnd';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslation } from '@/lib/i18n';

interface DataTypeFormProps {
  fields: FieldDefinition[];
  onUpdate: (fields: FieldDefinition[]) => void;
  parentId?: string; // New prop for unique droppableId
}

export function DataTypeForm({ fields, onUpdate, parentId }: DataTypeFormProps) {
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
        const updatedField: FieldDefinition = { ...field };

        // Apply direct updates (name, fields, itemType)
        if (updates.name !== undefined) updatedField.name = updates.name;
        if (updates.fields !== undefined) updatedField.fields = updates.fields;
        if (updates.itemType !== undefined) updatedField.itemType = updates.itemType;

        // Handle type change specifically
        if (updates.type !== undefined && updates.type !== field.type) {
          updatedField.type = updates.type;
          // Clean up properties based on old type
          if (field.type === 'object') {
            delete updatedField.fields;
          }
          if (field.type === 'array') {
            delete updatedField.itemType;
          }
          // Initialize properties based on new type
          if (updates.type === 'object') {
            updatedField.fields = [];
          }
          if (updates.type === 'array') {
            updatedField.itemType = 'string'; // Default item type
          }
        }

        // Handle options merging
        if (updates.options !== undefined) {
          updatedField.options = { ...(updatedField.options || {}), ...updates.options };
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={droppableId} key={droppableId}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
            <div className="grid grid-cols-[32px_1fr_260px_32px] gap-0 items-center text-sm text-gray-500 font-medium border-b border-gray-300">
              <div className="w-8 select-none flex items-center justify-center invisible">☰</div>
              <div className="px-2 py-1 border-r border-gray-200">{getTranslation(language, 'field_name')}</div>
              <div className="px-2 py-1 border-r border-gray-200">{getTranslation(language, 'data_type')}</div>
              <div className="w-8 flex items-center justify-center invisible">
                <Trash2 className="w-5 h-5" />
              </div>
            </div>
            {fields.map((field, idx) => (
              <Draggable key={String(field.id)} draggableId={String(field.id)} index={idx}>
                {(provided, snapshot) => (
                  <Fragment>
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`grid grid-cols-[32px_1fr_260px_32px] gap-0 items-center bg-white border-b border-gray-200 ${snapshot.isDragging ? 'ring-2 ring-blue-400' : ''}`}
                    >
                      <div {...provided.dragHandleProps} className="cursor-move flex items-center justify-center w-8 h-8"><GripVertical className="w-5 h-5" /></div>
                      <input
                        type="text"
                        value={field.name}
                        onChange={(e) => updateField(field.id, { name: e.target.value })}
                        className="px-2 py-1 border-none bg-transparent w-full focus:outline-none"
                        placeholder={getTranslation(language, 'field_name')}
                      />
                      <div className="px-2 py-1">
                        <DataTypeSelect
                          value={field.type}
                          onChange={(type) => updateField(field.id, { type })}
                        />
                      </div>
                      <button
                        onClick={() => removeField(field.id)}
                        className="flex items-center justify-center w-8 h-8 bg-red-50 hover:bg-red-100 rounded"
                        title={getTranslation(language, 'remove')}
                      >
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                      {/* IP address型の場合はIP version選択UIを表示 */}
                    {field.type === 'ipAddress' && (
                      <div className="ml-8 mt-1 p-2 border rounded bg-gray-50">
                        <div className="grid grid-cols-[32px_1fr_260px_32px] items-center">
                          <div></div>
                          <div className="flex items-center gap-2">
                            <label className="text-gray-700 font-medium whitespace-nowrap">IP version</label>
                          </div>
                          <div>
                            <select
                              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                              value={typeof field.options?.ipVersion === 'string' ? field.options.ipVersion : 'IPv4'}
                              onChange={e => updateField(field.id, { options: { ...field.options, ipVersion: e.target.value } })}
                            >
                              <option value="IPv4">IPv4</option>
                              <option value="IPv6">IPv6</option>
                            </select>
                          </div>
                          <div></div>
                        </div>
                      </div>
                    )}
                    {field.type === 'latLong' && (
                      <div className="ml-8 mt-1 p-2 border rounded bg-gray-50">
                        <div className="grid grid-cols-[32px_1fr_260px_32px] items-center">
                          <div></div>
                          <div className="flex items-center gap-2">
                            <label className="text-gray-700 font-medium whitespace-nowrap">Lat/Long Type</label>
                          </div>
                          <div>
                            <select
                              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                              value={typeof field.options?.latLongType === 'string' ? field.options.latLongType : 'both'}
                              onChange={e => updateField(field.id, { options: { ...field.options, latLongType: e.target.value as 'latitude' | 'longitude' | 'both' } })}
                            >
                              <option value="both">{getTranslation(language, 'lat_long_both')}</option>
                              <option value="latitude">{getTranslation(language, 'lat_only')}</option>
                              <option value="longitude">{getTranslation(language, 'long_only')}</option>
                            </select>
                          </div>
                          <div></div>
                        </div>
                      </div>
                    )}
                    {field.type === 'currency' && (
                      <div className="ml-8 mt-1 p-2 border rounded bg-gray-50">
                        <div className="grid grid-cols-[32px_1fr_260px_32px] items-center">
                          <div></div>
                          <div className="flex items-center gap-2">
                            <label className="text-gray-700 font-medium whitespace-nowrap">Currency Type</label>
                          </div>
                          <div>
                            <select
                              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                              value={typeof field.options?.currencyType === 'string' ? field.options.currencyType : 'yen'}
                              onChange={e => updateField(field.id, { options: { ...field.options, currencyType: e.target.value as 'yen' | 'dollar' } })}
                            >
                              <option value="yen">{getTranslation(language, 'yen')}</option>
                              <option value="dollar">{getTranslation(language, 'dollar')}</option>
                            </select>
                          </div>
                          <div></div>
                        </div>
                      </div>
                    )}
                    {field.type === 'object' && field.fields && (
                      <div className="ml-8 mt-1 p-2 border rounded bg-gray-50">
                        <h3 className="text-md font-bold mb-2">{getTranslation(language, 'object_fields')}</h3>
                        <DataTypeForm
                          fields={field.fields}
                          onUpdate={(newFields) => updateField(field.id, { fields: newFields })}
                          parentId={field.id}
                        />
                      </div>
                    )}
                    {field.type === 'array' && (
                      <div className="ml-8 mt-1 p-2 border rounded bg-gray-50 space-y-1">
                        {/* Array Item Type row */}
                        <div className="grid grid-cols-[32px_1fr_260px_32px] items-center">
                          <div></div>
                          <div className="flex items-center gap-2">
                            <label className="text-gray-700 font-medium whitespace-nowrap">{getTranslation(language, 'array_item_type')}</label>
                          </div>
                          <div>
                            <DataTypeSelect
                              value={field.itemType || 'string'}
                              onChange={(itemType) => updateField(field.id, { itemType })}
                              allowNestedTypes={false}
                            />
                          </div>
                          <div></div>
                        </div>
                          {/* 配列の要素型がIP addressの場合はIP version選択UIを表示 */}
                        {field.itemType === 'ipAddress' && (
                          <div className="ml-8 mt-1 p-2 border rounded bg-gray-50">
                            <div className="grid grid-cols-[32px_1fr_260px_32px] items-center">
                              <div></div>
                              <div className="flex items-center gap-2">
                                <label className="text-gray-700 font-medium whitespace-nowrap">IP version</label>
                              </div>
                              <div>
                                <select
                                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                  value={typeof field.options?.ipVersion === 'string' ? field.options.ipVersion : 'IPv4'}
                                  onChange={e => updateField(field.id, { options: { ...field.options, ipVersion: e.target.value } })}
                                >
                                  <option value="IPv4">IPv4</option>
                                  <option value="IPv6">IPv6</option>
                                </select>
                              </div>
                              <div></div>
                            </div>
                          </div>
                        )}
                          {/* 配列の要素型が緯度経度の場合に緯度経度タイプ選択UIを表示 */}
                        {field.itemType === 'latLong' && (
                          <div className="ml-8 mt-1 p-2 border rounded bg-gray-50">
                            <div className="grid grid-cols-[32px_1fr_260px_32px] items-center">
                              <div></div>
                              <div className="flex items-center gap-2">
                                <label className="text-gray-700 font-medium whitespace-nowrap">Lat/Long Type</label>
                              </div>
                              <div>
                                <select
                                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                  value={typeof field.options?.latLongType === 'string' ? field.options.latLongType : 'both'}
                                  onChange={e => updateField(field.id, { options: { ...field.options, latLongType: e.target.value as 'latitude' | 'longitude' | 'both' } })}
                                >
                                  <option value="both">{getTranslation(language, 'lat_long_both')}</option>
                                  <option value="latitude">{getTranslation(language, 'lat_only')}</option>
                                  <option value="longitude">{getTranslation(language, 'long_only')}</option>
                                </select>
                              </div>
                              <div></div>
                            </div>
                          </div>
                        )}
                          {/* 配列の要素型が通貨の場合に通貨タイプ選択UIを表示 */}
                        {field.itemType === 'currency' && (
                          <div className="ml-8 mt-1 p-2 border rounded bg-gray-50">
                            <div className="grid grid-cols-[32px_1fr_260px_32px] items-center">
                              <div></div>
                              <div className="flex items-center gap-2">
                                <label className="text-gray-700 font-medium whitespace-nowrap">Currency Type</label>
                              </div>
                              <div>
                                <select
                                  className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                  value={typeof field.options?.currencyType === 'string' ? field.options.currencyType : 'yen'}
                                  onChange={e => updateField(field.id, { options: { ...field.options, currencyType: e.target.value as 'yen' | 'dollar' } })}
                                >
                                  <option value="yen">{getTranslation(language, 'yen')}</option>
                                  <option value="dollar">{getTranslation(language, 'dollar')}</option>
                                </select>
                              </div>
                              <div></div>
                            </div>
                          </div>
                        )}
                        {/* Array Length row */}
                        <div className="grid grid-cols-[32px_1fr_260px_32px] items-center">
                          <div></div>
                          <div className="flex items-center gap-2">
                            <label className="text-gray-700 font-medium whitespace-nowrap">{getTranslation(language, 'array_length')}</label>
                          </div>
                          <div>
                            <input
                              type="number"
                              min="0"
                              value={typeof field.options?.arrayLength === 'number' ? field.options.arrayLength : 1}
                              onChange={(e) => {
                                const newArrayLength = parseInt(e.target.value);
                                updateField(field.id, {
                                  options: { ...field.options, arrayLength: isNaN(newArrayLength) ? undefined : newArrayLength },
                                });
                              }}
                              className="w-24 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-right"
                            />
                          </div>
                          <div></div>
                        </div>
                      </div>
                    )}
                  </Fragment>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <button
              onClick={addField}
              className="w-full bg-gray-100 p-2 rounded hover:bg-gray-200 mt-2"
            >
              {getTranslation(language, 'add_field')}
            </button>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}