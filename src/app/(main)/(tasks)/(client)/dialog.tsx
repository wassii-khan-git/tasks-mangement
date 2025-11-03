// src/components/layout/common/dialogs/edit-category-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Spinner from "../../../../../components/layout/common/loaders/spinner";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import {
  Category,
  Company,
} from "@/app/dashboard/(companies)/companies/columns";
import {
  CompanyEditFormValues,
  companyEditSchema,
} from "@/app/dashboard/(companies)/companies/(validation)/validation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { onSaveTypes } from "@/app/dashboard/types";
import {
  DeleteCompanyAction,
  UpdateCompanyAction,
} from "@/app/dashboard/(companies)/companies/(actions)/companies.actions";

export type companyEditType = {
  id: string;
  name: string;
  categoryId: string;
  percentage: string | number;
  logo: string | File | undefined;
  logoPublicId?: string | undefined;
};
interface EditCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Company | null;
  categories: Category[];
  onSave: (result: onSaveTypes) => void;
  action: string;
}

export default function CompanyDialog({
  open,
  onOpenChange,
  company,
  categories,
  onSave,
  action,
}: EditCompanyDialogProps) {
  // form
  const form = useForm<CompanyEditFormValues>({
    resolver: zodResolver(companyEditSchema),
    defaultValues: {
      categoryId: company?.categoryId || "",
      name: company?.name || "",
    },
  });

  const [loading, setLoading] = useState<boolean>(false);

  // has new Image
  const [hasNewImage, setHasNewImage] = useState<boolean>(false);
  // preview state
  const [preview, setPreview] = useState<string>("");
  // submit button
  const submitButtonText = action === "edit" ? "Save" : "Yes";

  // For update
  const handleUpdate = async (values: CompanyEditFormValues) => {
    console.log("values: ", values);
    const { logo, ...rest } = values; // Prefixed with underscore to indicate it's intentionally unused
    console.log("logo:", logo); // do not remove this line

    // form
    let imageFileString: string | File;
    //  if its file
    if (hasNewImage && values.logo instanceof File) {
      imageFileString = values.logo;
    } else if (company?.logo) {
      imageFileString = company.logo;
    } else {
      imageFileString = "";
    }

    const data = {
      ...rest,
      id: company?.id as string,
      logo: imageFileString,
    };
    console.log("data to submit: ", data);

    try {
      // call delete action
      const result = await UpdateCompanyAction(data);
      console.log("result: ", result);
      // call on save
      onSave({ success: result.success, message: result.message });
    } catch (error) {
      console.log("Error:", error);
    }
  };

  // For delete
  const handeDelete = async () => {
    // data
    try {
      setLoading(true);
      // call delete action
      const result = await DeleteCompanyAction(
        company?.id as string,
        company?.logoPublicId as string
      );
      console.log("result: ", result);
      onSave({ success: result.success, message: result.message });
    } catch (error) {
      console.log("Error:", error);
      setLoading(false);
    }
  };

  // handle image
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("logo", file);
      setHasNewImage(true);
      // update the state
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      return reader.readAsDataURL(file);
    }
  };

  // Memoized function to reset form data
  const resetFormData = useCallback(() => {
    if (company) {
      form.reset();
      form.setValue("name", company.name || "");
      form.setValue("categoryId", company.categoryId || "");
      setPreview(company.logo as string);
      setHasNewImage(false);
    }
  }, [form, company]);

  useEffect(() => {
    if (open && company?.logo) {
      setPreview(company.logo as string);
    }
  }, [open, company?.logo]);

  const handleDialogClose = () => {
    form.reset();
    setPreview("");
    onOpenChange(false);
  };

  useEffect(() => {
    if (open) {
      resetFormData();
    }
  }, [open, resetFormData]);

  console.log("Comapnmy: ", company);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === "edit" ? "Update Company" : "Confirmation"}
          </DialogTitle>
          <DialogDescription className="sr-only">
            This is update company dialog
          </DialogDescription>
        </DialogHeader>
        <Separator className="mt-3 mb-2" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdate)}>
            {action === "edit" ? (
              <div className="space-y-4 md:space-y-8 mb-2 md:mb-8">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    defaultValue={company?.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={company?.categoryId}
                        >
                          <FormControl className="w-full">
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="percentage"
                  defaultValue={company?.percentage.toString()}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Percentage *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Percentage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Image Upload */}
                <FormField
                  control={form.control}
                  name="logo"
                  render={({ field: { name, onBlur, ref } }) => (
                    <FormItem>
                      <FormLabel>Image *</FormLabel>
                      <FormControl>
                        <Input
                          name={name}
                          onBlur={onBlur}
                          ref={ref}
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleImageChange}
                          className="cursor-pointer"
                        />
                      </FormControl>
                      <FormMessage />
                      {preview && (
                        <div className="mt-2">
                          <Image
                            width={120}
                            height={80}
                            src={preview}
                            alt="Preview"
                            className="rounded border"
                          />
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </div>
            ) : (
              action === "delete" && (
                <h3>Are your sure your want to delete this record ?</h3>
              )
            )}

            <Separator className="mt-6 mb-5" />
            <DialogFooter>
              <div className="flex justify-end gap-2 items-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                  className=""
                >
                  Cancel
                </Button>
                <Button
                  disabled={form.formState.isSubmitting}
                  type={action === "edit" ? "submit" : "button"}
                  variant={action === "edit" ? "default" : "destructive"}
                  onClick={() => action !== "edit" && handeDelete()}
                  className="flex bg-indigo-500 hover:bg-indigo-400"
                >
                  {loading || form.formState.isSubmitting ? (
                    <Spinner
                      isPageLoader={false}
                      size={22}
                      className="text-white"
                    />
                  ) : (
                    submitButtonText
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
